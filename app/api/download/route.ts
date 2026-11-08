import { NextRequest, NextResponse } from 'next/server';
import { downloadRequestSchema } from '@/lib/validation';
import {
  validateTikTokUrl,
  resolveTikTokShortLink,
} from '@/lib/security/url-validation';
import { getRateLimiter, getClientIp } from '@/lib/security/rate-limit';
import { extractTikTokVideo, ProviderError } from '@/lib/providers';
import { DownloadApiResponse, DownloadErrorResponse } from '@/types/video';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse<DownloadApiResponse>> {
  // 1. Rate limiting check
  const clientIp = getClientIp(req);
  const rateLimiter = getRateLimiter();
  const rateCheck = await rateLimiter.limit(clientIp);

  const rateLimitHeaders = {
    'X-RateLimit-Limit': String(rateCheck.limit),
    'X-RateLimit-Remaining': String(rateCheck.remaining),
    'X-RateLimit-Reset': String(Math.ceil(rateCheck.resetMs / 1000)),
    'Cache-Control': 'no-store, max-age=0',
  };

  if (!rateCheck.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please wait a moment before trying again.',
        code: 'RATE_LIMITED',
        details: `Rate limit exceeded. Try again in ${Math.ceil(rateCheck.resetMs / 1000)} seconds.`,
      },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders,
          'Retry-After': String(Math.ceil(rateCheck.resetMs / 1000)),
        },
      }
    );
  }

  // 2. Parse and validate JSON request body
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid JSON body. Please submit a valid JSON payload with a "url" field.',
        code: 'INVALID_URL',
      },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  const parseResult = downloadRequestSchema.safeParse(rawBody);
  if (!parseResult.success) {
    const firstError = parseResult.error.errors[0]?.message || 'Invalid request parameters.';
    return NextResponse.json(
      {
        success: false,
        error: firstError,
        code: 'INVALID_URL',
      },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  const { url: submittedUrl } = parseResult.data;

  // 3. Strict URL validation and SSRF verification
  const urlValidation = validateTikTokUrl(submittedUrl);
  if (!urlValidation.isValid || !urlValidation.normalizedUrl) {
    return NextResponse.json(
      {
        success: false,
        error: urlValidation.error || 'The submitted link is not a valid TikTok video URL.',
        code: 'UNSUPPORTED_HOST',
      },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  let finalTargetUrl = urlValidation.normalizedUrl;

  // 4. Resolve short links safely (e.g. vm.tiktok.com or vt.tiktok.com)
  if (urlValidation.isShortLink) {
    try {
      finalTargetUrl = await resolveTikTokShortLink(finalTargetUrl);
    } catch (shortLinkErr: unknown) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Failed to resolve short TikTok link. The link may have expired or redirected to an unsupported location.',
          code: 'INVALID_URL',
          details: shortLinkErr instanceof Error ? shortLinkErr.message : undefined,
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }
  }

  // 5. Invoke provider adapter with timeout
  const abortController = new AbortController();
  const timeoutMs = 12000;
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const videoData = await extractTikTokVideo(finalTargetUrl, abortController.signal);
    clearTimeout(timeoutId);

    return NextResponse.json(
      {
        success: true,
        data: videoData,
      },
      {
        status: 200,
        headers: rateLimitHeaders,
      }
    );
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ProviderError) {
      let httpStatus = err.statusCode || 500;
      let errorCode: DownloadErrorResponse['code'] = 'PROVIDER_ERROR';

      if (err.code === 'CONFIG_MISSING') {
        errorCode = 'PROVIDER_NOT_CONFIGURED';
        httpStatus = 503;
      } else if (err.code === 'TIMEOUT') {
        errorCode = 'PROVIDER_TIMEOUT';
        httpStatus = 504;
      } else if (err.code === 'RATE_LIMITED') {
        errorCode = 'RATE_LIMITED';
        httpStatus = 429;
      } else if (err.code === 'VIDEO_NOT_FOUND') {
        errorCode = 'VIDEO_NOT_FOUND';
        httpStatus = 404;
      }

      return NextResponse.json(
        {
          success: false,
          error: err.message,
          code: errorCode,
        },
        { status: httpStatus, headers: rateLimitHeaders }
      );
    }

    // Generic unhandled internal error
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while processing the video request.',
        code: 'INTERNAL_ERROR',
      },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}

// Reject unsupported HTTP methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Method Not Allowed. Use POST with a JSON body containing { "url": "..." }',
      code: 'INVALID_URL',
    },
    { status: 405, headers: { Allow: 'POST' } }
  );
}
