'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Link as LinkIcon,
  Clipboard,
  X,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { validateTikTokUrl } from '@/lib/security/url-validation';
import { VideoMetadata, DownloadApiResponse } from '@/types/video';
import { LoadingState } from './LoadingState';
import { VideoResult } from './VideoResult';

export const DownloaderForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; code?: string; details?: string } | null>(
    null
  );
  const [videoResult, setVideoResult] = useState<VideoMetadata | null>(null);
  const [canPaste, setCanPaste] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if Clipboard API is supported
    if (
      typeof window !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.readText === 'function'
    ) {
      setCanPaste(true);
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setApiError(null);

    if (!value.trim()) {
      setClientError(null);
      return;
    }

    // Quick client-side sanity check
    const check = validateTikTokUrl(value);
    if (!check.isValid && value.length > 15) {
      setClientError(check.error || 'Please enter a valid TikTok link');
    } else {
      setClientError(null);
    }
  };

  const handleClear = () => {
    setUrl('');
    setClientError(null);
    setApiError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setApiError(null);
        const check = validateTikTokUrl(text.trim());
        if (!check.isValid) {
          setClientError(check.error || 'Pasted URL does not look like a TikTok link');
        } else {
          setClientError(null);
        }
      }
    } catch {
      setClientError('Clipboard access denied. Please paste manually into the input box.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setClientError('Please enter or paste a TikTok video URL.');
      return;
    }

    const check = validateTikTokUrl(trimmedUrl);
    if (!check.isValid) {
      setClientError(check.error || 'Please enter a valid TikTok video URL.');
      return;
    }

    setClientError(null);
    setApiError(null);
    setVideoResult(null);
    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
        signal: controller.signal,
      });

      const data = (await response.json()) as DownloadApiResponse;

      if (!response.ok || !data.success) {
        const errorMsg =
          !data.success && data.error
            ? data.error
            : `Failed with status code ${response.status}. Please check the URL and try again.`;
        setApiError({
          message: errorMsg,
          code: !data.success ? data.code : undefined,
          details: !data.success ? data.details : undefined,
        });
      } else {
        setVideoResult(data.data);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setApiError({
        message: 'Network connection error. Please verify your internet connection and try again.',
        code: 'NETWORK_ERROR',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVideoResult(null);
    setApiError(null);
    setUrl('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Downloader Input Card */}
      <div className="relative rounded-2xl bg-card border border-border/80 shadow-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
        {/* Subtle decorative glow */}
        <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary-cyan/60 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            {/* Input field wrapper */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-cyan transition-colors">
                <LinkIcon className="w-5 h-5" />
              </div>

              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Paste TikTok video link here (e.g. https://www.tiktok.com/@user/video/...)"
                aria-label="TikTok video link"
                className="w-full pl-11 pr-20 py-4 rounded-xl bg-background border border-border/80 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all disabled:opacity-50"
              />

              {/* Action buttons inside input */}
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                {url && (
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isLoading}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-card transition-colors"
                    title="Clear input"
                    aria-label="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {canPaste && !url && (
                  <button
                    type="button"
                    onClick={handlePaste}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-300 hover:text-primary-cyan bg-card hover:bg-card-hover border border-border rounded-lg transition-colors"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Paste</span>
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary-cyan to-primary-magenta text-white font-semibold text-base shadow-lg shadow-primary-cyan/20 hover:shadow-primary-cyan/40 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Get Video</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Real-time client error */}
          {clientError && (
            <div
              role="alert"
              className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-lg animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{clientError}</span>
            </div>
          )}

          {/* Quick instructions / examples */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 pt-1 gap-2">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary-cyan" />
              Supports standard web links and short links (vm.tiktok.com, vt.tiktok.com)
            </span>
            <span className="text-[11px] text-gray-400">
              Only publicly accessible videos can be processed
            </span>
          </div>
        </form>

        {/* Permitted Use Notice */}
        <div className="mt-4 pt-4 border-t border-border/50 text-[11px] text-gray-400 leading-normal flex items-start gap-2">
          <span className="font-semibold text-gray-300 shrink-0">Permitted Use Notice:</span>
          <span>
            This service is intended solely for personal, non-commercial archiving and offline viewing of publicly accessible creator content where permitted by copyright holders and applicable law.
          </span>
        </div>
      </div>

      {/* Backend API Error Banner */}
      {apiError && (
        <div
          role="alert"
          className="mt-6 p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <h4 className="font-semibold text-sm sm:text-base text-rose-100">
                Unable to retrieve video
              </h4>
              <p className="text-xs sm:text-sm text-rose-300/90 leading-relaxed">
                {apiError.message}
              </p>
              {apiError.details && (
                <p className="text-xs font-mono text-rose-400/80 bg-black/30 p-2 rounded border border-rose-900/40">
                  {apiError.details}
                </p>
              )}

              {/* Specific guidance for missing API provider configuration */}
              {apiError.code === 'PROVIDER_NOT_CONFIGURED' && (
                <div className="mt-3 p-3 rounded-xl bg-black/40 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-amber-300">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Administrator Configuration Required</span>
                  </div>
                  <p>
                    The backend video extraction adapter requires a valid RapidAPI subscription.
                    To enable live video fetching, add the following to your server environment (.env.local):
                  </p>
                  <pre className="bg-black/60 p-2 rounded text-[11px] font-mono text-gray-300 overflow-x-auto">
                    RAPIDAPI_KEY=your_rapidapi_key_here{'\n'}
                    RAPIDAPI_HOST=tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com
                  </pre>
                  <p className="text-[11px] text-gray-400">
                    Refer to the project README.md for step-by-step instructions on obtaining credentials.
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-900/50 hover:bg-rose-900 border border-rose-700/60 rounded-lg text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State Spinner & Skeleton */}
      {isLoading && <LoadingState />}

      {/* Success Video Result Display */}
      {videoResult && !isLoading && (
        <VideoResult video={videoResult} onReset={handleReset} />
      )}
    </div>
  );
};
