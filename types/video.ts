export interface VideoAuthor {
  username: string;
  nickname?: string;
  avatarUrl?: string;
}

export interface VideoStats {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

export interface VideoDownloadFormat {
  id: string;
  label: string;
  quality?: string;
  url: string;
  format: 'mp4' | 'mp3';
  isWatermarkFree: boolean;
  sizeFormatted?: string;
}

export interface VideoMetadata {
  id: string;
  title: string;
  author: VideoAuthor;
  coverUrl: string;
  durationSeconds?: number;
  stats?: VideoStats;
  formats: VideoDownloadFormat[];
  originalUrl: string;
  provider: string;
  expiresAt?: string;
}

export interface DownloadRequestBody {
  url: string;
}

export interface DownloadSuccessResponse {
  success: true;
  data: VideoMetadata;
}

export interface DownloadErrorResponse {
  success: false;
  error: string;
  code:
    | 'INVALID_URL'
    | 'UNSUPPORTED_HOST'
    | 'SSRF_DETECTED'
    | 'RATE_LIMITED'
    | 'PROVIDER_NOT_CONFIGURED'
    | 'PROVIDER_ERROR'
    | 'PROVIDER_TIMEOUT'
    | 'VIDEO_NOT_FOUND'
    | 'INTERNAL_ERROR';
  details?: string;
}

export type DownloadApiResponse = DownloadSuccessResponse | DownloadErrorResponse;
