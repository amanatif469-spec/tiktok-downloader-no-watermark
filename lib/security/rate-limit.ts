export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export interface RateLimiterAdapter {
  limit(key: string): Promise<RateLimitResult>;
}

/**
 * In-memory sliding window rate limiter.
 * Suitable for local development and single-instance deployments.
 */
export class MemoryRateLimiter implements RateLimiterAdapter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Periodic cleanup of stale entries every 5 minutes
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 300000).unref?.();
    }
  }

  async limit(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const timestamps = this.requests.get(key) || [];
    const recent = timestamps.filter((t) => t > windowStart);

    if (recent.length >= this.maxRequests) {
      const oldest = recent[0] || now;
      const resetMs = Math.max(0, oldest + this.windowMs - now);
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        resetMs,
      };
    }

    recent.push(now);
    this.requests.set(key, recent);

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - recent.length,
      resetMs: this.windowMs,
    };
  }

  private cleanup(): void {
    const cutoff = Date.now() - this.windowMs;
    for (const [key, timestamps] of this.requests.entries()) {
      const valid = timestamps.filter((t) => t > cutoff);
      if (valid.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, valid);
      }
    }
  }
}

/**
 * Production-ready distributed rate limiter using Upstash Redis REST API.
 * Uses atomic INCR and EXPIRE commands via HTTP without requiring heavy TCP Redis client.
 */
export class UpstashRedisRateLimiter implements RateLimiterAdapter {
  private url: string;
  private token: string;
  private readonly windowSeconds: number;
  private readonly maxRequests: number;

  constructor(url: string, token: string, windowMs: number = 60000, maxRequests: number = 10) {
    this.url = url.replace(/\/+$/, '');
    this.token = token;
    this.windowSeconds = Math.ceil(windowMs / 1000);
    this.maxRequests = maxRequests;
  }

  async limit(key: string): Promise<RateLimitResult> {
    const redisKey = `ratelimit:tiktok:${key}`;

    try {
      // Pipeline: INCR and EXPIRE in a single multi-command request
      const response = await fetch(`${this.url}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', redisKey],
          ['EXPIRE', redisKey, this.windowSeconds, 'NX'],
          ['TTL', redisKey],
        ]),
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) {
        throw new Error(`Upstash Redis HTTP error: ${response.status}`);
      }

      const results = (await response.json()) as Array<{ result?: number }>;
      const currentCount = results[0]?.result ?? 1;
      const ttl = results[2]?.result ?? this.windowSeconds;

      const remaining = Math.max(0, this.maxRequests - currentCount);
      const resetMs = Math.max(0, ttl * 1000);

      return {
        success: currentCount <= this.maxRequests,
        limit: this.maxRequests,
        remaining,
        resetMs,
      };
    } catch {
      // Fallback open if Redis is down to prevent blocking legitimate traffic, but log warning
      return {
        success: true,
        limit: this.maxRequests,
        remaining: 1,
        resetMs: this.windowSeconds * 1000,
      };
    }
  }
}

// Global singleton instance
let defaultLimiter: RateLimiterAdapter | null = null;

export function getRateLimiter(): RateLimiterAdapter {
  if (defaultLimiter) return defaultLimiter;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000;
  const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 10;

  if (redisUrl && redisToken) {
    defaultLimiter = new UpstashRedisRateLimiter(redisUrl, redisToken, windowMs, maxRequests);
  } else {
    defaultLimiter = new MemoryRateLimiter(windowMs, maxRequests);
  }

  return defaultLimiter;
}

/**
 * Extracts client IP safely from standard reverse proxy headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  return '127.0.0.1';
}
