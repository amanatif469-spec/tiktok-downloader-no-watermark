'use client';

import React, { useState, useEffect } from 'react';
import { DownloadCloud, Smartphone, X, Share2, PlusSquare, Compass } from 'lucide-react';

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
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone)
    ) {
      setIsInstalled(true);
      return;
    }

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
      setShowIOSModal(true);
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Top Banner for Mobile & Desktop */}
      <div className="w-full bg-gradient-to-r from-primary-cyan/20 via-card to-primary-magenta/20 border-b border-border/80 px-4 py-2.5 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-cyan to-primary-magenta flex items-center justify-center shrink-0 shadow-sm shadow-primary-cyan/20">
              <Smartphone className="w-4 h-4 text-gray-950 font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                <span>TikSave 2.0 App</span>
                <span className="text-[10px] bg-primary-cyan text-gray-950 font-extrabold px-1.5 py-0.2 rounded-full">
                  Free
                </span>
              </span>
              <span className="text-[11px] text-gray-300">
                Install on iPhone, Android &amp; PC for 1-tap fast downloading
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-primary-cyan to-cyan-300 text-gray-950 font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary-cyan/25 cursor-pointer shrink-0"
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

      {/* iPhone / iPad Step-by-Step Installation Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-card border border-border-light rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-cyan to-primary-magenta mx-auto flex items-center justify-center shadow-lg shadow-primary-cyan/30">
              <Smartphone className="w-7 h-7 text-gray-950" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">iPhone par Install karne ka Tareeqa</h3>
              <p className="text-xs text-gray-400 mt-1">
                Apple policy ke tehat iPhone par app direct 3 aasan steps mein install hoti hai:
              </p>
            </div>

            <div className="text-xs text-gray-200 text-left space-y-3 bg-background/80 p-4 rounded-2xl border border-border">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-cyan/20 text-primary-cyan font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-white">Safari Browser use karein</p>
                  <p className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5">
                    <Compass className="w-3.5 h-3.5 text-blue-400" />
                    Agar TikTok ya Chrome mein khula hai to link <strong>Safari</strong> mein open karein.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-cyan/20 text-primary-cyan font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-white">Share button dabayein</p>
                  <p className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5">
                    Niche beech mein <strong>Share</strong> icon (<Share2 className="w-3.5 h-3.5 text-primary-cyan inline" />) par tap karein.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-cyan/20 text-primary-cyan font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold text-white">&quot;Add to Home Screen&quot; par tap karein</p>
                  <p className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5">
                    Menu ko scroll karein, <PlusSquare className="w-3.5 h-3.5 text-primary-magenta inline" /> <strong>Add to Home Screen</strong> dabayein aur top-right par <strong>Add</strong> par click karein.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400">
              TikSave 2.0 ka app icon aapke iPhone ki home screen par aa jaye ga!
            </p>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-cyan to-primary-magenta text-white font-bold text-xs shadow-md"
            >
              Theek hai, Samajh gaya!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
