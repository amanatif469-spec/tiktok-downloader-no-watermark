import { VideoMetadata, VideoDownloadFormat } from '@/types/video';
import { VideoProviderAdapter, ProviderError } from './types';
import { apiConfig } from '../config';

export class RapidApiProvider implements VideoProviderAdapter {
  public name = 'rapidapi';

  isConfigured(): boolean {
    const key = apiConfig.rapidApi.key;
    return Boolean(key && key !== 'your_rapidapi_key_here' && key.trim().length > 8);
  }

  async extract(url: string, signal?: AbortSignal): Promise<VideoMetadata> {
    if (!this.isConfigured()) {
      throw new ProviderError(
        'RapidAPI video provider is not configured. Please supply a valid RAPIDAPI_KEY in server environment variables.',
        'CONFIG_MISSING',
        503
      );
    }

    const { key, host, endpoint } = apiConfig.rapidApi;

    // Construct query parameters or endpoint URL
    const targetUrl = new URL(endpoint);
    targetUrl.searchParams.set('url', url);

    let response: Response;
    try {
      response = await fetch(targetUrl.toString(), {
        method: 'GET',
        headers: {
          'x-rapidapi-key': key,
          'x-rapidapi-host': host,
          Accept: 'application/json',
        },
        signal,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ProviderError('Provider request timed out after 12 seconds.', 'TIMEOUT', 504);
      }
      throw new ProviderError(
        `Failed to communicate with provider: ${err instanceof Error ? err.message : 'Network error'}`,
        'UPSTREAM_ERROR',
        502
      );
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new ProviderError(
          'RapidAPI authorization failed. Please verify your RAPIDAPI_KEY and active subscription.',
          'UPSTREAM_ERROR',
          response.status
        );
      }
      if (response.status === 429) {
        throw new ProviderError(
          'Provider rate limit reached. Please wait a moment and try again.',
          'RATE_LIMITED',
          429
        );
      }
      if (response.status === 404) {
        throw new ProviderError(
          'The requested TikTok video could not be found or is private.',
          'VIDEO_NOT_FOUND',
          404
        );
      }
      throw new ProviderError(
        `Provider returned HTTP ${response.status}`,
        'UPSTREAM_ERROR',
        response.status
      );
    }

    let payload: Record<string, unknown>;
    try {
      payload = (await response.json()) as Record<string, unknown>;
    } catch {
      throw new ProviderError(
        'Invalid JSON payload returned by provider.',
        'INVALID_RESPONSE',
        502
      );
    }

    return this.parseRapidApiResponse(payload, url);
  }

  /**
   * Safely maps common RapidAPI TikTok response schemas to standard VideoMetadata
   */
  private parseRapidApiResponse(raw: Record<string, unknown>, originalUrl: string): VideoMetadata {
    // Some APIs wrap inside data: { ... } or return directly
    const data = (raw.data && typeof raw.data === 'object' ? raw.data : raw) as Record<
      string,
      unknown
    >;

    // Video ID
    const id = String(data.id || data.aweme_id || data.item_id || Date.now());

    // Title / description
    const title = String(
      data.title || data.desc || data.description || 'TikTok Video (No Watermark)'
    ).trim();

    // Author
    const authorRaw = (data.author && typeof data.author === 'object' ? data.author : {}) as Record<
      string,
      unknown
    >;
    const author = {
      username: String(authorRaw.unique_id || authorRaw.username || data.author_name || 'TikTok Creator'),
      nickname: authorRaw.nickname ? String(authorRaw.nickname) : undefined,
      avatarUrl: authorRaw.avatar || authorRaw.avatar_thumb ? String(authorRaw.avatar || authorRaw.avatar_thumb) : undefined,
    };

    // Cover thumbnail
    const coverUrl = String(
      data.cover || data.origin_cover || data.dynamic_cover || data.thumbnail || ''
    );

    // Formats extraction
    const formats: VideoDownloadFormat[] = [];

    // 1. HD / No Watermark Video (play, play_url, no_watermark, etc.)
    const noWmUrl =
      data.play ||
      data.hdplay ||
      data.video ||
      data.download_url ||
      data.nowatermark ||
      (Array.isArray(data.links) ? (data.links[0] as Record<string, unknown>)?.a : null);

    if (noWmUrl && typeof noWmUrl === 'string' && noWmUrl.startsWith('http')) {
      formats.push({
        id: 'no-watermark-hd',
        label: 'Download Video (No Watermark)',
        quality: 'HD 1080p / 720p',
        url: noWmUrl,
        format: 'mp4',
        isWatermarkFree: true,
      });
    }

    // 2. Alternative direct play or standard no watermark if available
    const standardPlay = data.wmplay || data.watermark;
    if (standardPlay && typeof standardPlay === 'string' && standardPlay.startsWith('http')) {
      formats.push({
        id: 'watermarked-original',
        label: 'Download Video (Original Watermark)',
        quality: 'Standard',
        url: standardPlay,
        format: 'mp4',
        isWatermarkFree: false,
      });
    }

    // 3. Audio / MP3 music track
    const musicUrl =
      data.music ||
      data.music_url ||
      ((data.music_info && typeof data.music_info === 'object'
        ? (data.music_info as Record<string, unknown>).play
        : null) as string | null);

    if (musicUrl && typeof musicUrl === 'string' && musicUrl.startsWith('http')) {
      formats.push({
        id: 'audio-track',
        label: 'Download Audio Only (MP3)',
        quality: 'Original Sound',
        url: musicUrl,
        format: 'mp3',
        isWatermarkFree: true,
      });
    }

    // If no valid video links were detected
    if (formats.length === 0) {
      throw new ProviderError(
        'The provider did not return any accessible video download links for this content.',
        'VIDEO_NOT_FOUND',
        404
      );
    }

    // Stats
    const stats = {
      views: typeof data.play_count === 'number' ? data.play_count : undefined,
      likes: typeof data.digg_count === 'number' ? data.digg_count : undefined,
      comments: typeof data.comment_count === 'number' ? data.comment_count : undefined,
      shares: typeof data.share_count === 'number' ? data.share_count : undefined,
    };

    return {
      id,
      title,
      author,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
      durationSeconds: typeof data.duration === 'number' ? data.duration : undefined,
      stats,
      formats,
      originalUrl,
      provider: 'RapidAPI',
    };
  }
}
