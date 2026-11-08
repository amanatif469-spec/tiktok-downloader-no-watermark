'use client';

import React from 'react';

export interface AdSlotProps {
  id: string;
  slotName: string;
  adSlotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  minHeight?: number | string;
}

/**
 * Reusable Google AdSense-ready AdSlot component.
 *
 * NOTE ON ADSENSE COMPLIANCE:
 * - Does NOT display fake ads or deceptive download buttons.
 * - Reserves dimensions to avoid Cumulative Layout Shift (CLS).
 * - Remains disabled until NEXT_PUBLIC_ADSENSE_CLIENT_ID is supplied.
 * - Clearly demarcated with "Advertisement" label when active.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  id,
  slotName,
  adSlotId,
  format = 'auto',
  className = '',
  minHeight = 90,
}) => {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isAdsenseConfigured = Boolean(
    clientId && clientId.startsWith('ca-pub-') && clientId.length > 10
  );

  // If ads are unconfigured and not in development preview mode, collapse gracefully
  if (!isAdsenseConfigured) {
    return (
      <div
        id={id}
        data-ad-slot={slotName}
        data-ad-slot-id={adSlotId}
        data-ad-format={format}
        className={`hidden border border-dashed border-border/40 rounded-xl p-3 text-center text-xs text-gray-500 my-4 ${className}`}
        aria-hidden="true"
      >
        {/* Ad slot reserved for: {slotName} (Supply NEXT_PUBLIC_ADSENSE_CLIENT_ID to activate) */}
      </div>
    );
  }

  return (
    <aside
      id={id}
      data-ad-slot-id={adSlotId}
      data-ad-format={format}
      aria-label={`Advertisement: ${slotName}`}
      className={`relative w-full overflow-hidden rounded-xl bg-card/60 border border-border/50 text-center my-6 flex flex-col items-center justify-center ${className}`}
      style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
    >
      <div className="w-full text-left px-3 py-1 border-b border-border/30">
        <span className="text-[10px] tracking-wider uppercase text-gray-400 font-medium">
          Advertisement
        </span>
      </div>

      <div className="w-full flex items-center justify-center py-2 px-2">
        {/*
          ========================================================================
          OFFICIAL GOOGLE ADSENSE CODE INTEGRATION
          Uncomment and inject the official adsbygoogle snippet once your domain
          is approved by Google AdSense:
          ========================================================================

          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={clientId}
            data-ad-slot={adSlotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: '(adsbygoogle = window.adsbygoogle || []).push({});',
            }}
          />
        */}
        <div className="text-xs text-gray-400 py-4 font-mono">
          AdSense Container [{slotName}]
        </div>
      </div>
    </aside>
  );
};
