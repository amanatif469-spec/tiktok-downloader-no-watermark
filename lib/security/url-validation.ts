const ALLOWED_TIKTOK_HOSTS = new Set([
  'tiktok.com',
  'www.tiktok.com',
  'm.tiktok.com',
  'vm.tiktok.com',
  'vt.tiktok.com',
]);

const PRIVATE_IP_REGEX = [
  /^127\./, // 127.0.0.0/8 (loopback)
  /^10\./, // 10.0.0.0/8 (private)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12 (private)
  /^192\.168\./, // 192.168.0.0/16 (private)
  /^169\.254\./, // 169.254.0.0/16 (link-local)
  /^0\./, // 0.0.0.0/8
  /^localhost$/i,
  /^.*\.local$/i,
  /^.*\.internal$/i,
  /^::1$/, // IPv6 loopback
  /^fc00:/i, // IPv6 Unique Local
  /^fe80:/i, // IPv6 Link-Local
];

export interface UrlValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  error?: string;
  isShortLink?: boolean;
}

/**
 * Checks if a hostname belongs to allowed TikTok domains
 */
export function isAllowedTikTokHost(hostname: string): boolean {
  const normalizedHost = hostname.toLowerCase().trim();
  if (ALLOWED_TIKTOK_HOSTS.has(normalizedHost)) {
    return true;
  }
  // Subdomains like en.tiktok.com or web.tiktok.com
  if (normalizedHost.endsWith('.tiktok.com')) {
    const parts = normalizedHost.split('.');
    if (parts.length >= 2 && parts.slice(-2).join('.') === 'tiktok.com') {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a host is private or localhost to prevent SSRF
 */
export function isPrivateOrLocalHost(host: string): boolean {
  const cleanHost = host.toLowerCase().trim();
  return PRIVATE_IP_REGEX.some((regex) => regex.test(cleanHost));
}

/**
 * Validates and normalizes user-submitted TikTok URL
 */
export function validateTikTokUrl(inputUrl: string): UrlValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, error: 'Please enter a TikTok URL' };
  }

  const trimmed = inputUrl.trim();
  if (trimmed.length > 500) {
    return { isValid: false, error: 'URL exceeds maximum length of 500 characters' };
  }

  let parsed: URL;
  try {
    // If user forgot protocol, prepend https://
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsed = new URL(withProtocol);
  } catch {
    return { isValid: false, error: 'Malformed URL. Please enter a valid web address.' };
  }

  // Ensure protocol is HTTPS (or HTTP upgraded to HTTPS)
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { isValid: false, error: 'Invalid URL protocol. Only HTTPS links are supported.' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // SSRF check
  if (isPrivateOrLocalHost(hostname)) {
    return {
      isValid: false,
      error: 'Security violation: Access to private or local network addresses is prohibited.',
    };
  }

  // Check allowed hosts
  if (!isAllowedTikTokHost(hostname)) {
    return {
      isValid: false,
      error:
        'Unsupported domain. Only official TikTok domains (tiktok.com, vm.tiktok.com, vt.tiktok.com) are accepted.',
    };
  }

  const pathname = parsed.pathname;

  // Short links: vm.tiktok.com/XXXXX or vt.tiktok.com/XXXXX
  const isShortLink = hostname === 'vm.tiktok.com' || hostname === 'vt.tiktok.com';
  if (isShortLink) {
    if (!pathname || pathname === '/' || pathname.length < 3) {
      return { isValid: false, error: 'Incomplete TikTok short link format.' };
    }
    return {
      isValid: true,
      normalizedUrl: `https://${hostname}${pathname}`,
      isShortLink: true,
    };
  }

  // Standard video paths: /@user/video/1234567890 or /v/1234567890
  const standardVideoPattern = /^\/@[\w.-]+\/video\/\d+/i;
  const shortIdPattern = /^\/v\/\d+/i;
  const shareVideoPattern = /^\/@[\w.-]+\/(?:photo|video)\/\d+/i;

  if (
    standardVideoPattern.test(pathname) ||
    shortIdPattern.test(pathname) ||
    shareVideoPattern.test(pathname)
  ) {
    // Keep clean URL with pathname and necessary query parameters if any
    return {
      isValid: true,
      normalizedUrl: `https://${hostname}${pathname}`,
      isShortLink: false,
    };
  }

  // Some share links look like https://www.tiktok.com/t/ZT8... or /share/video/...
  if (pathname.startsWith('/t/') || pathname.startsWith('/share/')) {
    return {
      isValid: true,
      normalizedUrl: `https://${hostname}${pathname}`,
      isShortLink: true,
    };
  }

  return {
    isValid: false,
    error:
      'Invalid TikTok URL structure. Expected format: https://www.tiktok.com/@username/video/1234567890 or https://vm.tiktok.com/ZM...',
  };
}

/**
 * Safely resolves short links (e.g. vm.tiktok.com) with strict redirect limits and host validation
 */
export async function resolveTikTokShortLink(
  shortUrl: string,
  maxRedirects: number = 3,
  timeoutMs: number = 8000
): Promise<string> {
  let currentUrl = shortUrl;
  let redirects = 0;

  while (redirects < maxRedirects) {
    const validation = validateTikTokUrl(currentUrl);
    if (!validation.isValid) {
      throw new Error(`Invalid URL encountered during resolution: ${validation.error}`);
    }

    // If it's already a standard video URL and not a short link, return it
    if (!validation.isShortLink && currentUrl.includes('/video/')) {
      return currentUrl;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const status = response.status;
      if (status >= 300 && status < 400) {
        const location = response.headers.get('location');
        if (!location) {
          throw new Error('Redirect returned with empty Location header.');
        }

        // Parse new target URL
        const redirectUrl = new URL(location, currentUrl).toString();
        const checkTarget = validateTikTokUrl(redirectUrl);

        if (!checkTarget.isValid) {
          throw new Error(`Untrusted redirect target destination: ${location}`);
        }

        currentUrl = redirectUrl;
        redirects++;

        if (redirectUrl.includes('/video/')) {
          return redirectUrl;
        }
      } else if (response.ok) {
        // Did not redirect; might already be destination
        return currentUrl;
      } else {
        throw new Error(`Failed to resolve short link. Server responded with status ${status}`);
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Short link resolution timed out.');
      }
      throw err;
    }
  }

  return currentUrl;
}
