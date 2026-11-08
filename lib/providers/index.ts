import { VideoMetadata } from '@/types/video';
import { VideoProviderAdapter, ProviderError } from './types';
import { RapidApiProvider } from './rapidapi';
import { TikWmProvider } from './tikwm';

export * from './types';
export * from './rapidapi';
export * from './tikwm';

// Registry of available provider adapters in priority order
const rapidApiProvider = new RapidApiProvider();
const tikWmProvider = new TikWmProvider();

/**
 * Returns the active configured provider adapter
 */
export function getActiveProvider(): VideoProviderAdapter {
  if (rapidApiProvider.isConfigured()) {
    return rapidApiProvider;
  }
  return tikWmProvider;
}

/**
 * Executes video extraction with fallback support
 * Tries RapidAPI if configured; seamlessly falls back to free high-speed TikWM provider
 */
export async function extractTikTokVideo(url: string, signal?: AbortSignal): Promise<VideoMetadata> {
  const activeProviders: VideoProviderAdapter[] = [];

  if (rapidApiProvider.isConfigured()) {
    activeProviders.push(rapidApiProvider);
  }
  activeProviders.push(tikWmProvider);

  let lastError: ProviderError | null = null;

  for (const provider of activeProviders) {
    try {
      return await provider.extract(url, signal);
    } catch (err) {
      if (err instanceof ProviderError) {
        lastError = err;
        // Don't retry if video is definitely private or deleted
        if (err.code === 'VIDEO_NOT_FOUND' && activeProviders.indexOf(provider) === activeProviders.length - 1) {
          throw err;
        }
      } else {
        lastError = new ProviderError(
          err instanceof Error ? err.message : 'Unknown provider error',
          'UPSTREAM_ERROR'
        );
      }
    }
  }

  throw (
    lastError ||
    new ProviderError(
      'Unable to extract video download streams from this URL. Please verify the video is public.',
      'UPSTREAM_ERROR',
      502
    )
  );
}
