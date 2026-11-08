import { z } from 'zod';
import { validateTikTokUrl } from './security/url-validation';

export const downloadRequestSchema = z.object({
  url: z
    .string({
      required_error: 'TikTok URL is required',
      invalid_type_error: 'URL must be a string',
    })
    .trim()
    .min(1, 'Please enter a TikTok URL')
    .max(500, 'URL cannot exceed 500 characters')
    .refine((val) => {
      const res = validateTikTokUrl(val);
      return res.isValid;
    }, {
      message:
        'Please enter a valid TikTok video URL (e.g. https://www.tiktok.com/@user/video/12345 or https://vm.tiktok.com/ZM...)',
    }),
});

export type DownloadRequestInput = z.infer<typeof downloadRequestSchema>;

export const videoAuthorSchema = z.object({
  username: z.string(),
  nickname: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const videoFormatSchema = z.object({
  id: z.string(),
  label: z.string(),
  quality: z.string().optional(),
  url: z.string().url(),
  format: z.enum(['mp4', 'mp3']),
  isWatermarkFree: z.boolean(),
  sizeFormatted: z.string().optional(),
});

export const videoMetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: videoAuthorSchema,
  coverUrl: z.string().url(),
  durationSeconds: z.number().optional(),
  stats: z
    .object({
      views: z.number().optional(),
      likes: z.number().optional(),
      comments: z.number().optional(),
      shares: z.number().optional(),
    })
    .optional(),
  formats: z.array(videoFormatSchema).min(1, 'At least one download format must be available'),
  originalUrl: z.string().url(),
  provider: z.string(),
  expiresAt: z.string().optional(),
});
