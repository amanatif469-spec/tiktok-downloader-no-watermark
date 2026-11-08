'use client';

import React from 'react';
import { AdSlot } from './AdSlot';

interface AdBannerProps {
  position: 'hero-bottom' | 'result-side' | 'faq-top';
  className?: string;
}

/**
 * Pre-configured Ad Banner placements for key high-traffic conversion zones
 */
export const AdBanner: React.FC<AdBannerProps> = ({ position, className = '' }) => {
  switch (position) {
    case 'hero-bottom':
      return (
        <AdSlot
          id="ad-slot-hero-bottom"
          slotName="Hero Bottom Responsive Banner"
          format="horizontal"
          minHeight={90}
          className={`max-w-4xl mx-auto ${className}`}
        />
      );

    case 'result-side':
      return (
        <AdSlot
          id="ad-slot-result-side"
          slotName="Result Action Sidebar"
          format="rectangle"
          minHeight={250}
          className={`w-full max-w-sm ${className}`}
        />
      );

    case 'faq-top':
      return (
        <AdSlot
          id="ad-slot-faq-top"
          slotName="Content FAQ Leaderboard"
          format="horizontal"
          minHeight={90}
          className={`max-w-4xl mx-auto ${className}`}
        />
      );

    default:
      return null;
  }
};
