import { VideoMetadata } from '@/types/video';

export interface VideoProviderAdapter {
  name: string;
  isConfigured(): boolean;
  extract(url: string, signal?: AbortSignal): Promise<VideoMetadata>;
}

export class ProviderError extends Error {
  public code:
    | 'CONFIG_MISSING'
    | 'TIMEOUT'
    | 'RATE_LIMITED'
    | 'VIDEO_NOT_FOUND'
    | 'INVALID_RESPONSE'
    | 'UPSTREAM_ERROR';
  public statusCode?: number;

  constructor(
    message: string,
    code:
      | 'CONFIG_MISSING'
      | 'TIMEOUT'
      | 'RATE_LIMITED'
      | 'VIDEO_NOT_FOUND'
      | 'INVALID_RESPONSE'
      | 'UPSTREAM_ERROR',
    statusCode?: number
  ) {
    super(message);
    this.name = 'ProviderError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
