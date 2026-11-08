import React from 'react';
import Link from 'next/link';
import { Video, Shield, Heart } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export const Footer: React.FC = () => {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-card/40 border-t border-border mt-20 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border/50">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-cyan to-primary-magenta flex items-center justify-center">
                <Video className="w-4 h-4 text-gray-950 font-bold" />
              </div>
              <span className="font-extrabold text-white text-base">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              Fast, privacy-focused online tool for retrieving publicly accessible TikTok videos without watermarks for personal offline backup and educational purposes.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
              <Shield className="w-4 h-4 text-primary-cyan" />
              <span>SSL Encrypted &amp; Secure Direct CDN Delivery</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white uppercase tracking-wider">
              Quick Navigation
            </p>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                <Link href="/" className="hover:text-primary-cyan transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-primary-cyan transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-primary-cyan transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white uppercase tracking-wider">
              Legal &amp; Policy
            </p>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-primary-cyan transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-cyan transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="hover:text-primary-cyan transition-colors"
                >
                  Contact: {siteConfig.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-8 space-y-4 text-[11px] text-gray-400 leading-relaxed text-center md:text-left">
          <p>
            <strong>Disclaimer:</strong> {siteConfig.shortName} is an independent online utility and is not affiliated with, sponsored by, authorized by, or endorsed by TikTok, ByteDance Ltd., or any of their affiliates or subsidiaries. TikTok and the TikTok logo are registered trademarks of ByteDance Ltd.
          </p>
          <p>
            We do not host or store copyrighted video or audio content on our servers. All video streams and audio media files are indexed and extracted from publicly accessible third-party endpoints. Users are strictly responsible for respecting the intellectual property rights of content creators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/30 text-gray-400">
            <span>&copy; {currentYear} {siteConfig.name}. All rights reserved.</span>
            <span className="flex items-center gap-1 text-[11px]">
              Engineered with <Heart className="w-3 h-3 text-primary-magenta fill-primary-magenta" /> for performance and privacy.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
