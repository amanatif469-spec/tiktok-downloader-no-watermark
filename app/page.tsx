import React from 'react';
import {
  Shield,
  Smartphone,
  Sparkles,
  Zap,
  ChevronDown,
  Info,
  Layers,
  Lock,
  Share2,
} from 'lucide-react';
import { DownloaderForm } from '@/components/downloader/DownloaderForm';
import { AdBanner } from '@/components/ads/AdBanner';
import { JsonLd } from '@/components/seo/JsonLd';

const FAQ_ITEMS = [
  {
    question: 'How do I download a TikTok video without a watermark?',
    answer:
      'Open the TikTok application or website, navigate to the public video you wish to save, tap the "Share" button, and tap "Copy Link". Next, paste the copied link into the input box at the top of this page and click "Get Video". Once parsed, click the prominent "Download Video (No Watermark)" button to save the MP4 file directly to your device.',
  },
  {
    question: 'Is this TikTok downloader free to use?',
    answer:
      'Yes, the downloader is completely free to use for personal, private offline backup of publicly accessible video content. No registration, user accounts, or subscription fees are required.',
  },
  {
    question: 'Can I use this tool on Android?',
    answer:
      'Yes. On Android smartphones and tablets, simply open any standard mobile browser (such as Google Chrome, Firefox, or Samsung Internet), paste your TikTok video link into our tool, and download the video file directly into your device downloads folder.',
  },
  {
    question: 'Does the downloader work on iPhone and iPad?',
    answer:
      'Yes. On iOS devices (iOS 13+), open Safari, paste the TikTok link, and tap download. Safari will prompt you to download the MP4 file to your "Files" app (Downloads folder), from which you can easily save it to your Photos Camera Roll.',
  },
  {
    question: 'Do I need to install an application or browser extension?',
    answer:
      'No installation is necessary. This is a 100% web-based application that runs directly in any modern desktop, tablet, or mobile web browser.',
  },
  {
    question: 'Why is my TikTok link not working?',
    answer:
      'Common reasons include: (1) The video is hosted on a private account or restricted to friends only; (2) The video has been deleted or removed by TikTok for community guidelines violations; (3) The link syntax is incomplete; or (4) The link is an invalid non-TikTok domain. Verify the video opens in an incognito browser window and try again.',
  },
  {
    question: 'Can I download private TikTok videos?',
    answer:
      'No. Our service strictly respects creator privacy settings and technical access controls. We cannot, and will not attempt to, bypass privacy restrictions or retrieve videos from private or password-protected accounts.',
  },
  {
    question: 'Why did my video download link expire?',
    answer:
      'TikTok and its content delivery networks (CDNs) employ temporary, cryptographically signed security tokens on media streams that automatically expire after a few hours. If a link expires, simply paste the TikTok URL into our search box again to generate a fresh, active download URL.',
  },
  {
    question: 'Does this website store or retain my TikTok URLs?',
    answer:
      'No. We adhere to an ephemeral, zero-retention processing architecture. URLs submitted to our server API are processed in memory solely to query public metadata and generate direct media links, and are discarded immediately upon request completion.',
  },
  {
    question: 'Is it legal to download and reuse TikTok videos?',
    answer:
      'Downloading publicly accessible videos for personal, private offline viewing or archival is generally considered fair use in many jurisdictions. However, redistributing, modifying, re-uploading, or commercializing another creator’s copyrighted content without explicit permission is an infringement of intellectual property rights. Always respect creators and credit original work.',
  },
  {
    question: 'Can I download every video in Full HD (1080p)?',
    answer:
      'The output quality depends entirely on the resolution uploaded by the original creator to TikTok. If the creator recorded and uploaded in 1080p, our tool will provide the high-definition stream. If the source was recorded at standard definition (720p or 576p), the download will match that original uploaded source.',
  },
  {
    question: 'Why is the download button unavailable for my video?',
    answer:
      'If the download button is disabled or unavailable, it indicates that the upstream video provider was unable to locate a clean, authorized media stream for that specific post (for instance, if the video has been muted, audio-copyright flagged, or geoblocked). Try another video or inspect the error message details.',
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd faqItems={FAQ_ITEMS} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-hero-gradient pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/80 border border-border text-xs font-medium text-gray-300 mb-6 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary-cyan animate-pulse" />
            <span>Fast, Free &amp; High Definition MP4 Extraction</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Download TikTok Videos{' '}
            <span className="bg-gradient-to-r from-primary-cyan via-[#00c8ff] to-primary-magenta bg-clip-text text-transparent">
              Without Watermark
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="mt-5 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Paste a publicly accessible TikTok video link to retrieve available video information and download options in a simple, responsive interface.
          </p>

          {/* Core Interactive Downloader Tool */}
          <div className="mt-10">
            <DownloaderForm />
          </div>

          {/* Hero Bottom Ad Slot Container */}
          <AdBanner position="hero-bottom" className="mt-8" />
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="py-12 border-y border-border/50 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-card/60 border border-border/60">
              <div className="p-3 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 text-primary-cyan shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Direct CDN Delivery</h3>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                  Fast downloads streamed straight from authorized content networks with zero server throttling.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-card/60 border border-border/60">
              <div className="p-3 rounded-xl bg-primary-magenta/10 border border-primary-magenta/20 text-primary-magenta shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Zero-Retention Privacy</h3>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                  We never store user URLs, track video histories, or require account logins.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-card/60 border border-border/60">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">All Devices Supported</h3>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                  Responsive design engineered for iPhone, Android, iPad, Mac, and Windows PCs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Educational Section */}
      <section id="how-it-works" className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-cyan/10 border border-primary-cyan/30 text-primary-cyan text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How to Download TikTok Videos
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Follow these straightforward steps to retrieve any public TikTok video cleanly on your device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-primary-cyan text-gray-950 font-black text-lg flex items-center justify-center mb-5 shadow-lg shadow-primary-cyan/20">
              1
            </div>
            <h3 className="font-bold text-white text-base mb-2">Copy Video Link</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Open the TikTok application or website. Navigate to the video, tap the <strong>Share</strong> arrow icon, and select <strong>Copy Link</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-cyan to-primary-magenta text-white font-black text-lg flex items-center justify-center mb-5 shadow-lg shadow-primary-magenta/20">
              2
            </div>
            <h3 className="font-bold text-white text-base mb-2">Paste Into Tool</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Paste the copied URL into the search box at the top of this website and click the <strong>Get Video</strong> button to start server analysis.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-primary-magenta text-white font-black text-lg flex items-center justify-center mb-5 shadow-lg shadow-primary-magenta/20">
              3
            </div>
            <h3 className="font-bold text-white text-base mb-2">Save Clean MP4</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Inspect the video preview and click <strong>Download Video (No Watermark)</strong> to initiate your browser download directly.
            </p>
          </div>
        </div>

        {/* Detailed device guides */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-background border border-border/80">
            <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-primary-cyan" />
              <span>How to copy links on Mobile (iOS &amp; Android)</span>
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-gray-400 leading-relaxed">
              <li>Launch the official TikTok app and find the video you want.</li>
              <li>Tap the curved <strong>Share</strong> button on the right-hand action column.</li>
              <li>Swipe through the row of share options and tap <strong>Copy link</strong>.</li>
              <li>A temporary banner saying &quot;Link copied&quot; will confirm success.</li>
            </ol>
          </div>

          <div className="p-6 rounded-2xl bg-background border border-border/80">
            <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-3">
              <Share2 className="w-4 h-4 text-primary-magenta" />
              <span>How to copy links on Desktop Browser</span>
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-gray-400 leading-relaxed">
              <li>Visit <span className="font-mono text-gray-300">tiktok.com</span> in Chrome, Safari, Edge, or Firefox.</li>
              <li>Click on the video thumbnail to open the standalone video viewer.</li>
              <li>Copy the full address from your browser address bar or click the share button and choose <strong>Copy link</strong>.</li>
              <li>Return here and paste into our downloader.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Technical and Educational Overview */}
      <section className="py-16 bg-card/20 border-t border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Understanding Watermark-Free TikTok Extraction
            </h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              When a creator uploads a video to TikTok, the original video file is stored on content delivery servers before the application renders its floating animated logo overlay. Our authorized provider adapter queries the publicly accessible video manifest to retrieve the original, high-bitrate video stream directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-400 leading-relaxed">
            <div className="p-5 rounded-xl bg-card border border-border/70 space-y-2">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-primary-cyan" />
                <span>Why Download Links Expire</span>
              </h4>
              <p>
                Video file links provided by TikTok infrastructure include time-based security parameters (cryptographic signatures). These signatures protect servers from unauthorized caching and expire automatically within several hours. Always initiate your download promptly after retrieving the link.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border/70 space-y-2">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-magenta" />
                <span>Copyright &amp; Creator Rights</span>
              </h4>
              <p>
                We advocate for ethical content consumption. Videos downloaded through this site should be used strictly for private offline viewing, personal archives, or fair-use educational critique. Never re-upload another creator&apos;s hard work without giving appropriate attribution and receiving explicit consent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Top Ad Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <AdBanner position="faq-top" />
      </div>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Answers to common questions about downloading TikTok videos without watermarks, supported formats, and system privacy.
          </p>
        </div>

        {/* Native accessible details/summary accordion elements */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={index}
              className="group rounded-2xl bg-card border border-border/80 overflow-hidden transition-all duration-200 open:border-primary-cyan/40"
            >
              <summary className="flex items-center justify-between p-5 text-sm sm:text-base font-semibold text-white cursor-pointer select-none hover:text-primary-cyan transition-colors list-none">
                <span className="pr-4">{item.question}</span>
                <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-180 group-open:text-primary-cyan" />
              </summary>
              <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-border/40 pt-3">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
