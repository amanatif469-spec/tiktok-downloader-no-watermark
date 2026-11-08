export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'TikTok Downloader — No Watermark',
  shortName: 'TikTok Downloader',
  description:
    'Download publicly accessible TikTok videos without watermark in high definition. Fast, secure, and mobile-friendly with direct download links.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  contactEmail: process.env.SITE_CONTACT_EMAIL || 'support@example.com',
  keywords: [
    'TikTok downloader without watermark',
    'TikTok video downloader',
    'Download TikTok videos online',
    'TikTok downloader free online',
    'TikTok no watermark HD',
    'Save TikTok video MP4',
  ],
};

export const apiConfig = {
  provider: (process.env.VIDEO_PROVIDER || 'rapidapi').toLowerCase(),
  rapidApi: {
    key: process.env.RAPIDAPI_KEY || '',
    host:
      process.env.RAPIDAPI_HOST ||
      'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com',
    endpoint:
      process.env.RAPIDAPI_ENDPOINT ||
      'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/index',
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
  },
  requestTimeoutMs: 12000,
  maxUrlLength: 500,
};

export function isProviderConfigured(): boolean {
  if (apiConfig.provider === 'rapidapi') {
    return Boolean(
      apiConfig.rapidApi.key &&
        apiConfig.rapidApi.key !== 'your_rapidapi_key_here' &&
        apiConfig.rapidApi.host &&
        apiConfig.rapidApi.endpoint
    );
  }
  return false;
}
