import { describe, it, expect, vi, afterEach } from 'vitest';
import { POST, GET } from '@/app/api/download/route';
import { NextRequest } from 'next/server';

function createRequest(body: unknown, method = 'POST', headers: Record<string, string> = {}): NextRequest {
  const url = 'http://localhost:3000/api/download';
  if (method === 'GET') {
    return new NextRequest(url, { method: 'GET', headers });
  }
  return new NextRequest(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/download Route Handler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject GET requests with HTTP 405 Method Not Allowed', async () => {
    const req = createRequest(null, 'GET');
    const response = await GET();
    expect(response.status).toBe(405);
    const json = await response.json();
    expect(json.success).toBe(false);
  });

  it('should reject malformed non-JSON requests with HTTP 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'not a json',
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.code).toBe('INVALID_URL');
  });

  it('should reject non-TikTok URLs with HTTP 400', async () => {
    const req = createRequest({ url: 'https://www.youtube.com/watch?v=12345' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('valid TikTok');
  });

  it('should reject SSRF localhost URLs with HTTP 400', async () => {
    const req = createRequest({ url: 'http://127.0.0.1:8080/exploit' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
  });

  it('should return 503 PROVIDER_NOT_CONFIGURED when no provider credentials exist', async () => {
    const req = createRequest({
      url: 'https://www.tiktok.com/@creator/video/7123456789012345678',
    });
    const response = await POST(req);
    // When no RAPIDAPI_KEY is present in env, it should respond with 503
    expect(response.status).toBe(503);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.code).toBe('PROVIDER_NOT_CONFIGURED');
    expect(json.error).toContain('RAPIDAPI_KEY');
  });
});
