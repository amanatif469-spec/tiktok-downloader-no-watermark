import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  const filename = searchParams.get('name') || 'tiksave-video';
  const type = searchParams.get('type') || 'mp4';

  if (!targetUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://www.tiktok.com/',
      },
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      // If streaming fails, redirect directly to the CDN url as fallback
      return NextResponse.redirect(targetUrl);
    }

    const cleanFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}.${type}`;
    const contentType = type === 'mp3' ? 'audio/mpeg' : 'video/mp4';

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Disposition', `attachment; filename="${cleanFilename}"`);
    responseHeaders.set('Content-Type', contentType);
    if (upstreamRes.headers.get('content-length')) {
      responseHeaders.set('Content-Length', upstreamRes.headers.get('content-length')!);
    }
    responseHeaders.set('Cache-Control', 'public, max-age=3600');

    return new NextResponse(upstreamRes.body as unknown as ReadableStream, {
      status: 200,
      headers: responseHeaders,
    });
  } catch {
    // If proxying errors out, redirect to target URL
    return NextResponse.redirect(targetUrl);
  }
}
