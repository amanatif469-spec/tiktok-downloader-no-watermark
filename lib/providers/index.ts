import { VideoMetadata } from '@/types/video';
import { VideoProviderAdapter, ProviderError } from './types';
import { RapidApiProvider } from './rapidapi';

export * from './types';
export * from './rapidapi';

// Registry of available provider adapters
const providers: VideoProviderAdapter[] = [new RapidApiProvider()];

/**
 * Returns the active configured provider adapter or null if none is configured
 */
export function getActiveProvider(): VideoProviderAdapter | null {
  for (const provider of providers) {
    if (provider.isConfigured()) {
      return provider;
    }
  }
  return null;
}

/**
 * Executes video extraction with fallback support if multiple providers are active
 */
export async function extractTikTokVideo(url: string, signal?: AbortSignal): Promise<VideoMetadata> {
  const configuredProviders = providers.filter((p) => p.isConfigured());

  if (configuredProviders.length === 0) {
    throw new ProviderError(
      'No video processing provider is configured. Please set RAPIDAPI_KEY in server environment variables to enable video extraction.',
      'CONFIG_MISSING',
      503
    );
  }

  let lastError: ProviderError | null = null;

  for (const provider of configuredProviders) {
    try {
      return await provider.extract(url, signal);
    } catch (err) {
      if (err instanceof ProviderError) {
        lastError = err;
        // Don't retry permanent client errors (like invalid video id or 404)
        if (err.code === 'VIDEO_NOT_FOUND') {
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
      'All configured video extraction providers failed to process this URL.',
      'UPSTREAM_ERROR',
      502
    )
  );
}
