'use client';

import React, { useState, useEffect } from 'react';
import { DownloadCloud, Smartphone, X, CheckCircle, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone)
    ) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Browser fallback instructions
      alert('To install TikSave: tap your browser menu (⋮) and select "Add to Home screen" or "Install App"');
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Top Banner or Notification for Mobile & Desktop */}
      <div className="w-full bg-gradient-to-r from-primary-cyan/15 via-card to-primary-magenta/15 border-b border-border/80 px-4 py-2.5 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-cyan to-primary-magenta flex items-center justify-center shrink-0 shadow-sm shadow-primary-cyan/20">
              <Smartphone className="w-4 h-4 text-gray-950 font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                Get the TikSave App
              </span>
              <span className="text-[11px] text-gray-400">
                Install on your phone or PC for 1-tap fast downloads
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-cyan text-gray-950 font-bold text-xs hover:bg-cyan-300 transition-colors shadow-sm cursor-pointer"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-card-hover transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Install Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-primary-cyan/20 text-primary-cyan mx-auto flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Install TikSave on iPhone / iPad</h3>
            <ol className="text-xs text-gray-300 text-left space-y-2.5 bg-background p-4 rounded-xl border border-border">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-cyan shrink-0">1.</span>
                <span>
                  Safari browser ke niche <strong>Share</strong> button (<Share className="w-3.5 h-3.5 inline mx-0.5 text-primary-cyan" />) par tap karein.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-cyan shrink-0">2.</span>
                <span>Scroll karein aur <strong>&quot;Add to Home Screen&quot;</strong> par tap karein.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-cyan shrink-0">3.</span>
                <span>Top-right par <strong>&quot;Add&quot;</strong> daba dein. TikSave app aapke phone par aa jaye gi!</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-card-hover border border-border text-xs font-semibold text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
