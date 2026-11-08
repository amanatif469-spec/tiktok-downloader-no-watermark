import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RapidApiProvider } from '@/lib/providers/rapidapi';
import { apiConfig } from '@/lib/config';

describe('RapidApiProvider', () => {
  let provider: RapidApiProvider;
  const originalKey = apiConfig.rapidApi.key;

  beforeEach(() => {
    provider = new RapidApiProvider();
  });

  afterEach(() => {
    apiConfig.rapidApi.key = originalKey;
    vi.restoreAllMocks();
  });

  it('should identify unconfigured credentials', () => {
    apiConfig.rapidApi.key = '';
    expect(provider.isConfigured()).toBe(false);

    apiConfig.rapidApi.key = 'your_rapidapi_key_here';
    expect(provider.isConfigured()).toBe(false);
  });

  it('should throw CONFIG_MISSING error when unconfigured', async () => {
    apiConfig.rapidApi.key = '';
    await expect(
      provider.extract('https://www.tiktok.com/@test/video/12345')
    ).rejects.toMatchObject({
      code: 'CONFIG_MISSING',
      statusCode: 503,
    });
  });

  it('should handle HTTP 401/403 authorization failure from RapidAPI', async () => {
    apiConfig.rapidApi.key = 'mock-real-key-12345';

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Invalid API key' }), {
        status: 401,
        statusText: 'Unauthorized',
      })
    );

    await expect(
      provider.extract('https://www.tiktok.com/@test/video/12345')
    ).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
      statusCode: 401,
    });
  });

  it('should handle HTTP 404 video not found', async () => {
    apiConfig.rapidApi.key = 'mock-real-key-12345';

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Video not found' }), {
        status: 404,
        statusText: 'Not Found',
      })
    );

    await expect(
      provider.extract('https://www.tiktok.com/@test/video/12345')
    ).rejects.toMatchObject({
      code: 'VIDEO_NOT_FOUND',
      statusCode: 404,
    });
  });

  it('should successfully parse valid provider response payload', async () => {
    apiConfig.rapidApi.key = 'mock-real-key-12345';

    const mockPayload = {
      code: 0,
      data: {
        id: '7190000000000000000',
        title: 'Amazing Dance Routine #viral',
        cover: 'https://p16.tiktokcdn.com/cover.jpg',
        play: 'https://v16.tiktokcdn.com/video-no-wm.mp4',
        wmplay: 'https://v16.tiktokcdn.com/video-wm.mp4',
        music: 'https://sf16.tiktokcdn.com/music.mp3',
        author: {
          unique_id: 'creatordance',
          nickname: 'Creator Dance',
          avatar: 'https://p16.tiktokcdn.com/avatar.jpg',
        },
        play_count: 500000,
        digg_count: 85000,
        comment_count: 1200,
      },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockPayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const result = await provider.extract(
      'https://www.tiktok.com/@creatordance/video/7190000000000000000'
    );

    expect(result.id).toBe('7190000000000000000');
    expect(result.title).toBe('Amazing Dance Routine #viral');
    expect(result.author.username).toBe('creatordance');
    expect(result.formats.length).toBe(3);

    const noWm = result.formats.find((f) => f.id === 'no-watermark-hd');
    expect(noWm).toBeDefined();
    expect(noWm?.url).toBe('https://v16.tiktokcdn.com/video-no-wm.mp4');
    expect(noWm?.isWatermarkFree).toBe(true);

    const audio = result.formats.find((f) => f.id === 'audio-track');
    expect(audio).toBeDefined();
    expect(audio?.format).toBe('mp3');
  });
});
