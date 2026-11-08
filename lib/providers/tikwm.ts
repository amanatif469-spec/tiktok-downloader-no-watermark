import { VideoMetadata, VideoDownloadFormat } from '@/types/video';
import { VideoProviderAdapter, ProviderError } from './types';

export class TikWmProvider implements VideoProviderAdapter {
  public name = 'tikwm-public';

  isConfigured(): boolean {
    return true; // Always available as a free public extractor fallback
  }

  async extract(url: string, signal?: AbortSignal): Promise<VideoMetadata> {
    const endpoint = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        signal,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ProviderError('Provider request timed out after 12 seconds.', 'TIMEOUT', 504);
      }
      throw new ProviderError(
        `Failed to reach public video provider: ${err instanceof Error ? err.message : 'Network error'}`,
        'UPSTREAM_ERROR',
        502
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        `Public provider responded with HTTP ${response.status}`,
        'UPSTREAM_ERROR',
        response.status
      );
    }

    let payload: Record<string, unknown>;
    try {
      payload = (await response.json()) as Record<string, unknown>;
    } catch {
      throw new ProviderError('Invalid response from video provider.', 'INVALID_RESPONSE', 502);
    }

    const code = Number(payload.code);
    if (code !== 0 || !payload.data || typeof payload.data !== 'object') {
      const msg = typeof payload.msg === 'string' ? payload.msg : 'Failed to retrieve video';
      throw new ProviderError(
        msg.includes('private') || msg.includes('not found')
          ? 'This TikTok video is private, removed, or cannot be accessed.'
          : msg,
        'VIDEO_NOT_FOUND',
        404
      );
    }

    const data = payload.data as Record<string, unknown>;
    const authorRaw = (data.author && typeof data.author === 'object' ? data.author : {}) as Record<
      string,
      unknown
    >;

    const id = String(data.id || Date.now());
    const title = String(data.title || 'TikTok Video (No Watermark)').trim();

    const author = {
      username: String(authorRaw.unique_id || authorRaw.nickname || 'tiktok_creator'),
      nickname: authorRaw.nickname ? String(authorRaw.nickname) : undefined,
      avatarUrl: authorRaw.avatar ? String(authorRaw.avatar) : undefined,
    };

    const coverUrl = String(data.cover || data.origin_cover || '');

    const formats: VideoDownloadFormat[] = [];

    // 1. HD No Watermark (play)
    if (typeof data.play === 'string' && data.play.startsWith('http')) {
      formats.push({
        id: 'no-watermark-hd',
        label: 'Download Video (No Watermark)',
        quality: 'HD 1080p / 720p',
        url: data.play,
        format: 'mp4',
        isWatermarkFree: true,
      });
    }

    // 2. Original Watermarked (wmplay)
    if (typeof data.wmplay === 'string' && data.wmplay.startsWith('http')) {
      formats.push({
        id: 'watermarked-original',
        label: 'Download Video (Original Watermark)',
        quality: 'Standard',
        url: data.wmplay,
        format: 'mp4',
        isWatermarkFree: false,
      });
    }

    // 3. Audio Track (music)
    if (typeof data.music === 'string' && data.music.startsWith('http')) {
      formats.push({
        id: 'audio-track',
        label: 'Download Audio Only (MP3)',
        quality: 'Original Sound',
        url: data.music,
        format: 'mp3',
        isWatermarkFree: true,
      });
    }

    if (formats.length === 0) {
      throw new ProviderError(
        'The provider did not return any accessible video download links.',
        'VIDEO_NOT_FOUND',
        404
      );
    }

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
      originalUrl: url,
      provider: 'Direct Stream API',
    };
  }
}
