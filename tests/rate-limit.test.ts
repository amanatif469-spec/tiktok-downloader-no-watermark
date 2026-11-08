import { describe, it, expect } from 'vitest';
import { MemoryRateLimiter } from '@/lib/security/rate-limit';

describe('MemoryRateLimiter', () => {
  it('should allow requests under the maximum limit', async () => {
    const limiter = new MemoryRateLimiter(60000, 3);
    const ip = '192.0.2.1';

    const req1 = await limiter.limit(ip);
    expect(req1.success).toBe(true);
    expect(req1.remaining).toBe(2);

    const req2 = await limiter.limit(ip);
    expect(req2.success).toBe(true);
    expect(req2.remaining).toBe(1);

    const req3 = await limiter.limit(ip);
    expect(req3.success).toBe(true);
    expect(req3.remaining).toBe(0);
  });

  it('should block requests exceeding the maximum limit', async () => {
    const limiter = new MemoryRateLimiter(60000, 2);
    const ip = '192.0.2.2';

    await limiter.limit(ip);
    await limiter.limit(ip);

    const blocked = await limiter.limit(ip);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetMs).toBeGreaterThan(0);
  });

  it('should track separate clients independently', async () => {
    const limiter = new MemoryRateLimiter(60000, 1);
    const clientA = '198.51.100.1';
    const clientB = '198.51.100.2';

    const resA1 = await limiter.limit(clientA);
    expect(resA1.success).toBe(true);

    const resA2 = await limiter.limit(clientA);
    expect(resA2.success).toBe(false);

    // Client B should still have quota
    const resB1 = await limiter.limit(clientB);
    expect(resB1.success).toBe(true);
  });
});
