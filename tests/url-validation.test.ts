import { describe, it, expect } from 'vitest';
import {
  validateTikTokUrl,
  isAllowedTikTokHost,
  isPrivateOrLocalHost,
} from '@/lib/security/url-validation';

describe('TikTok URL Validation & Security', () => {
  describe('Hostname checks', () => {
    it('should accept valid TikTok hostnames', () => {
      expect(isAllowedTikTokHost('tiktok.com')).toBe(true);
      expect(isAllowedTikTokHost('www.tiktok.com')).toBe(true);
      expect(isAllowedTikTokHost('m.tiktok.com')).toBe(true);
      expect(isAllowedTikTokHost('vm.tiktok.com')).toBe(true);
      expect(isAllowedTikTokHost('vt.tiktok.com')).toBe(true);
    });

    it('should reject invalid or malicious hostnames', () => {
      expect(isAllowedTikTokHost('fake-tiktok.com')).toBe(false);
      expect(isAllowedTikTokHost('tiktok.com.evil.com')).toBe(false);
      expect(isAllowedTikTokHost('youtube.com')).toBe(false);
      expect(isAllowedTikTokHost('instagram.com')).toBe(false);
    });
  });

  describe('SSRF private IP detection', () => {
    it('should identify localhost and loopback addresses', () => {
      expect(isPrivateOrLocalHost('localhost')).toBe(true);
      expect(isPrivateOrLocalHost('127.0.0.1')).toBe(true);
      expect(isPrivateOrLocalHost('127.0.1.10')).toBe(true);
      expect(isPrivateOrLocalHost('::1')).toBe(true);
    });

    it('should identify RFC 1918 private network addresses', () => {
      expect(isPrivateOrLocalHost('10.0.0.1')).toBe(true);
      expect(isPrivateOrLocalHost('192.168.1.100')).toBe(true);
      expect(isPrivateOrLocalHost('172.16.0.1')).toBe(true);
      expect(isPrivateOrLocalHost('172.31.255.255')).toBe(true);
      expect(isPrivateOrLocalHost('169.254.169.254')).toBe(true); // AWS/cloud metadata
    });

    it('should allow public domain names', () => {
      expect(isPrivateOrLocalHost('tiktok.com')).toBe(false);
      expect(isPrivateOrLocalHost('www.tiktok.com')).toBe(false);
    });
  });

  describe('validateTikTokUrl', () => {
    it('should validate and normalize standard video URLs', () => {
      const url = 'https://www.tiktok.com/@creator123/video/7123456789012345678';
      const result = validateTikTokUrl(url);
      expect(result.isValid).toBe(true);
      expect(result.normalizedUrl).toBe('https://www.tiktok.com/@creator123/video/7123456789012345678');
      expect(result.isShortLink).toBe(false);
    });

    it('should normalize URLs with query parameters safely', () => {
      const url =
        'https://www.tiktok.com/@user/video/7123456789012345678?is_from_webapp=1&sender_device=pc';
      const result = validateTikTokUrl(url);
      expect(result.isValid).toBe(true);
      expect(result.normalizedUrl).toBe('https://www.tiktok.com/@user/video/7123456789012345678');
    });

    it('should validate short links (vm.tiktok.com and vt.tiktok.com)', () => {
      const vmResult = validateTikTokUrl('https://vm.tiktok.com/ZM8ABC123/');
      expect(vmResult.isValid).toBe(true);
      expect(vmResult.isShortLink).toBe(true);

      const vtResult = validateTikTokUrl('https://vt.tiktok.com/ZSeXYZ789/');
      expect(vtResult.isValid).toBe(true);
      expect(vtResult.isShortLink).toBe(true);
    });

    it('should reject empty or whitespace URLs', () => {
      expect(validateTikTokUrl('').isValid).toBe(false);
      expect(validateTikTokUrl('   ').isValid).toBe(false);
    });

    it('should reject URLs exceeding 500 characters', () => {
      const longUrl = 'https://www.tiktok.com/@user/video/12345?' + 'a'.repeat(550);
      const result = validateTikTokUrl(longUrl);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('maximum length');
    });

    it('should reject SSRF attempts', () => {
      const result = validateTikTokUrl('http://127.0.0.1/video/123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Security violation');
    });

    it('should reject unsupported domains', () => {
      const result = validateTikTokUrl('https://www.instagram.com/reel/12345');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unsupported domain');
    });
  });
});
