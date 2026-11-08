'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-4xl mx-auto mt-8 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-pulse"
    >
      {/* Background glowing sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-cyan/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cover Skeleton */}
        <div className="w-full lg:w-72 aspect-[9/16] max-h-96 bg-border/40 rounded-xl flex items-center justify-center shrink-0">
          <Loader2 className="w-10 h-10 text-primary-cyan animate-spin opacity-80" />
        </div>

        {/* Details Skeleton */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-border/60 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-border/70 rounded" />
              <div className="h-3 w-20 bg-border/40 rounded" />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-border/60 rounded" />
            <div className="h-4 w-5/6 bg-border/50 rounded" />
            <div className="h-4 w-2/3 bg-border/40 rounded" />
          </div>

          {/* Action skeleton buttons */}
          <div className="pt-6 space-y-3">
            <div className="h-12 w-full bg-border/60 rounded-xl" />
            <div className="h-12 w-full bg-border/40 rounded-xl" />
          </div>

          <div className="flex items-center justify-center gap-2 pt-4 text-xs text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin text-primary-cyan" />
            <span>Analyzing video stream and retrieving direct download options...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
