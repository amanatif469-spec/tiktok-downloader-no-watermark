import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, EyeOff, Server, Cookie, HelpCircle } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${siteConfig.name}. Learn how we process TikTok URLs, handle diagnostics, and respect user privacy.`,
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 6, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb / Back button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-primary-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Downloader</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-border/80 pb-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-cyan/10 border border-primary-cyan/30 text-primary-cyan text-xs font-medium mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy &amp; Data Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Last revised on: <time dateTime="2026-11-06">{lastUpdated}</time>
        </p>
      </div>

      {/* Structured Content */}
      <div className="space-y-10 text-sm text-gray-300 leading-relaxed">
        {/* 1. Introduction */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>1. Introduction</span>
          </h2>
          <p>
            Welcome to {siteConfig.name} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting personal data. This Privacy Policy describes how we handle information when you interact with our website, our URL analysis tool, and our associated services.
          </p>
          <p>
            By using this website, you agree to the practices outlined in this policy. If you do not agree with any part of this policy, please do not use our services.
          </p>
        </section>

        {/* 2. Information We Process */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-cyan" />
            <span>2. Information We Process</span>
          </h2>
          <p>
            Our service is engineered around principles of minimal data collection:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 pl-2">
            <li>
              <strong>Submitted URLs:</strong> When you enter a publicly accessible TikTok video link into our downloader form, that URL is transmitted to our server-side API solely to resolve public metadata and generate direct media links. We do not store, catalog, or associate submitted URLs with personal profiles or user accounts.
            </li>
            <li>
              <strong>No Account Required:</strong> We do not require registration, login, usernames, passwords, or payment credentials.
            </li>
            <li>
              <strong>Transient Memory Processing:</strong> Submitted URLs are processed in memory during the lifetime of the API request and discarded once the response is returned to your browser.
            </li>
          </ul>
        </section>

        {/* 3. Server Logs and Operational Diagnostics */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-primary-cyan" />
            <span>3. Server Logs and Operational Diagnostics</span>
          </h2>
          <p>
            When accessing our web servers, standard diagnostic telemetry may be temporarily recorded by our hosting infrastructure. This data includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 pl-2">
            <li>Internet Protocol (IP) address for rate limiting, DDoS mitigation, and abuse prevention.</li>
            <li>Browser user-agent string and operating system architecture.</li>
            <li>Date, timestamp, and HTTP response status code.</li>
          </ul>
          <p>
            These logs are used exclusively for security audits, service health monitoring, and mitigating abusive automated bots. They are retained only for temporary operational windows in accordance with standard hosting provider retention cycles.
          </p>
        </section>

        {/* 4. Third-Party Video Processing Providers */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-primary-cyan" />
            <span>4. Third-Party Video Processing Providers</span>
          </h2>
          <p>
            To retrieve media links without watermarks, our backend acts as an orchestrator, querying configured third-party APIs (such as RapidAPI TikTok data providers).
          </p>
          <p>
            When our server forwards a public TikTok video URL to an authorized provider:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 pl-2">
            <li>Your client IP address is never forwarded to the provider; requests originate securely from our backend server.</li>
            <li>The provider processes the public TikTok URL to extract public CDN download links.</li>
            <li>We do not store or host downloaded media files on our own infrastructure; video streams are delivered directly from authorized content delivery networks.</li>
          </ul>
        </section>

        {/* 5. Cookies and Local Storage */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cookie className="w-5 h-5 text-primary-cyan" />
            <span>5. Cookies and Advertising Technologies</span>
          </h2>
          <p>
            {siteConfig.name} does not use first-party tracking cookies or marketing profiling cookies.
          </p>
          <p>
            When third-party advertising services (such as Google AdSense) are active on this website:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 pl-2">
            <li>Third-party vendors, including Google, use cookies to serve ads based on prior visits to this or other websites.</li>
            <li>Users may opt out of personalized advertising by visiting Google Ads Settings (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-cyan underline">adssettings.google.com</a>) or www.aboutads.info.</li>
          </ul>
        </section>

        {/* 6. Data Security and Encryption */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Data Security and Encryption</h2>
          <p>
            We implement industry-standard technical safeguards to protect data in transit. All communications between your browser and our servers are encrypted using modern Transport Layer Security (TLS 1.3 / HTTPS). Furthermore, server-side requests employ strict input length validation, SSRF network filters, and automated rate limiting to resist abuse.
          </p>
        </section>

        {/* 7. Children&apos;s Privacy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">7. Children&apos;s Online Privacy Protection</h2>
          <p>
            Our service is not directed to individuals under the age of 13 (or under 16 in certain European jurisdictions). We do not knowingly solicit or collect personally identifiable information from children. If you become aware that a child has provided us with personal data, please contact us so we can immediately delete any transient records.
          </p>
        </section>

        {/* 8. User Rights and Inquiries */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary-cyan" />
            <span>8. User Rights and Inquiries</span>
          </h2>
          <p>
            Depending on your jurisdiction (such as under the EU General Data Protection Regulation or the California Consumer Privacy Act), you may have rights regarding access to, correction of, or deletion of your personal data. Because we do not store personal profiles, accounts, or submitted URLs, we generally hold no personal data linked to your identity.
          </p>
          <p>
            For privacy inquiries, contact our designated privacy contact at:
          </p>
          <div className="p-4 rounded-xl bg-card border border-border text-xs font-mono text-gray-200">
            Email: <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary-cyan underline">{siteConfig.contactEmail}</a>
          </div>
        </section>

        {/* 9. Changes to this Policy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">9. Changes to this Privacy Policy</h2>
          <p>
            We may update our Privacy Policy periodically to reflect technological adjustments, legal requirements, or operational updates. Any revisions will be published on this page with an updated &quot;Last revised&quot; date.
          </p>
        </section>
      </div>
    </div>
  );
}
