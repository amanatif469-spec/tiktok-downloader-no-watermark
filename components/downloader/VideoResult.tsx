'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Download,
  Music,
  Share2,
  Check,
  RefreshCw,
  Eye,
  Heart,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { VideoMetadata, VideoDownloadFormat } from '@/types/video';
import { AdBanner } from '../ads/AdBanner';

interface VideoResultProps {
  video: VideoMetadata;
  onReset: () => void;
}

export const VideoResult: React.FC<VideoResultProps> = ({ video, onReset }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingFormatId, setDownloadingFormatId] = useState<string | null>(null);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(video.originalUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleTriggerDownload = (format: VideoDownloadFormat) => {
    setDownloadingFormatId(format.id);

    // Open direct provider CDN download link in new tab or trigger browser download
    const link = document.createElement('a');
    link.href = format.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = `tiktok-${video.id}-${format.id}.${format.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingFormatId(null);
    }, 2000);
  };

  const noWmFormat = video.formats.find((f) => f.isWatermarkFree && f.format === 'mp4');
  const otherFormats = video.formats.filter((f) => f !== noWmFormat);

  return (
    <section
      aria-label="Video Download Details"
      className="w-full max-w-5xl mx-auto mt-8 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
    >
      {/* Accent corner ambient light */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-magenta/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
        {/* Cover Thumbnail Preview */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col items-center">
          <div className="relative w-full aspect-[9/16] max-h-96 rounded-xl overflow-hidden border border-border bg-black/60 shadow-lg group">
            {video.coverUrl ? (
              <Image
                src={video.coverUrl}
                alt={video.title || 'TikTok video thumbnail preview'}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                No preview image
              </div>
            )}

            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-primary-cyan flex items-center gap-1.5 border border-primary-cyan/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ready for download</span>
            </div>
          </div>

          {/* Social Stats if available */}
          {video.stats && (
            <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center text-xs text-gray-400 bg-background/50 rounded-lg p-2 border border-border/40">
              {video.stats.views !== undefined && (
                <div className="flex flex-col items-center">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Eye className="w-3 h-3 text-primary-cyan" /> Views
                  </span>
                  <span className="font-semibold text-gray-200">
                    {video.stats.views.toLocaleString()}
                  </span>
                </div>
              )}
              {video.stats.likes !== undefined && (
                <div className="flex flex-col items-center">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Heart className="w-3 h-3 text-accent-magenta" /> Likes
                  </span>
                  <span className="font-semibold text-gray-200">
                    {video.stats.likes.toLocaleString()}
                  </span>
                </div>
              )}
              {video.stats.comments !== undefined && (
                <div className="flex flex-col items-center">
                  <span className="flex items-center gap-1 text-[11px]">
                    <MessageCircle className="w-3 h-3 text-blue-400" /> Comments
                  </span>
                  <span className="font-semibold text-gray-200">
                    {video.stats.comments.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Details & Download Options */}
        <div className="flex-1 w-full flex flex-col justify-between">
          <div className="space-y-4">
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {video.author.avatarUrl ? (
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border/80 bg-background shrink-0">
                    <Image
                      src={video.author.avatarUrl}
                      alt={video.author.username}
                      fill
                      sizes="44px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full bg-border flex items-center justify-center font-bold text-gray-300">
                    @
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-white text-base leading-tight">
                    {video.author.nickname || video.author.username}
                  </h3>
                  <p className="text-xs text-primary-cyan font-mono">
                    @{video.author.username.replace(/^@/, '')}
                  </p>
                </div>
              </div>

              {/* Reset Search Button */}
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white bg-card-hover border border-border hover:border-border-light transition-colors"
                title="Search another video"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Search</span>
              </button>
            </div>

            {/* Video Title / Caption */}
            <div>
              <p className="text-sm text-gray-200 line-clamp-3 leading-relaxed">
                {video.title || 'TikTok Video (No description provided by creator)'}
              </p>
            </div>

            {/* Primary Download Button (No Watermark HD) */}
            <div className="pt-2">
              {noWmFormat ? (
                <button
                  type="button"
                  onClick={() => handleTriggerDownload(noWmFormat)}
                  disabled={downloadingFormatId === noWmFormat.id}
                  className="w-full group relative flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary-cyan via-[#00d2ff] to-[#00b4d8] text-gray-950 font-bold text-base shadow-[0_0_25px_rgba(0,242,254,0.35)] hover:shadow-[0_0_35px_rgba(0,242,254,0.5)] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                  <span>
                    {downloadingFormatId === noWmFormat.id
                      ? 'Opening Download Link...'
                      : 'Download Without Watermark (HD MP4)'}
                  </span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                  Watermark-free version was not supplied by the provider for this video. You may still download other available streams below.
                </div>
              )}
            </div>

            {/* Secondary Formats (Audio / Watermarked / Alternative) */}
            {otherFormats.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Alternative Download Formats
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {otherFormats.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => handleTriggerDownload(fmt)}
                      disabled={downloadingFormatId === fmt.id}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-background/80 hover:bg-card-hover border border-border hover:border-border-light text-xs text-gray-200 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {fmt.format === 'mp3' ? (
                          <Music className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Download className="w-4 h-4 text-gray-400" />
                        )}
                        {fmt.label}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {fmt.quality || fmt.format.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Expiration and Direct CDN Note */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-background/60 border border-border/40 text-xs text-gray-400">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span>
                  Provider download links are cryptographically signed and temporary. If a download fails to trigger automatically, you can right-click the button and choose &quot;Save Link As...&quot;.
                </span>
              </div>
            </div>

            {/* Utility Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">URL Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy Original TikTok Link</span>
                  </>
                )}
              </button>

              <a
                href={video.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-cyan transition-colors"
              >
                <span>View on TikTok</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Desktop Sidebar Ad Slot Integration */}
          <div className="mt-6 pt-4 border-t border-border/40">
            <AdBanner position="result-side" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
};
