import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, ShieldCheck, Scale, Globe } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service and Acceptable Use Policy for ${siteConfig.name}. Please review our terms regarding copyright and fair use.`,
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsOfServicePage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-magenta/10 border border-primary-magenta/30 text-primary-magenta text-xs font-medium mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Terms &amp; User Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Last revised on: <time dateTime="2026-11-06">{lastUpdated}</time>
        </p>
      </div>

      {/* Structured Content */}
      <div className="space-y-10 text-sm text-gray-300 leading-relaxed">
        {/* 1. Agreement to Terms */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing or using {siteConfig.name} (the &quot;Service&quot;), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        {/* 2. Acceptable Use and Restrictions */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary-cyan" />
            <span>2. Permitted Purpose and Acceptable Use</span>
          </h2>
          <p>
            The Service is provided exclusively for personal, private, and lawful use. You agree not to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 pl-2">
            <li>
              Attempt to process, decrypt, or access private videos, follower-only content, password-protected videos, or content subject to technical protection measures.
            </li>
            <li>
              Use automated bots, scrapers, or scripts to submit excessive requests or deliberately overwhelm our infrastructure.
            </li>
            <li>
              Submit malicious URLs, local network addresses, localhost endpoints, or IP addresses intended to cause Server-Side Request Forgery (SSRF).
            </li>
            <li>
              Redistribute, commercialize, or re-license downloaded content without explicit authorization from the original copyright holder.
            </li>
          </ul>
        </section>

        {/* 3. Intellectual Property and Copyright Responsibility */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary-magenta" />
            <span>3. Copyright and Intellectual Property</span>
          </h2>
          <p>
            <strong>User Responsibility:</strong> You acknowledge that all videos, audios, music compositions, visual effects, and images accessible via TikTok are the exclusive intellectual property of their respective creators, rights owners, or licensors.
          </p>
          <p>
            You represent and warrant that you possess all necessary rights, licenses, or fair use justifications required to retrieve, store, or view any content requested through this tool. {siteConfig.name} does not endorse or authorize the infringement of any third-party copyrights.
          </p>
          <p>
            We do not host or archive video files on our servers. Our system functions solely as a client-side link resolution orchestrator that requests publicly accessible media manifests from third-party endpoints.
          </p>
        </section>

        {/* 4. Third-Party Provider Limitations and Temporary Links */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-cyan" />
            <span>4. Provider Availability and Temporary URLs</span>
          </h2>
          <p>
            Video metadata and download streams are parsed dynamically via independent third-party APIs. We make no guarantee that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 pl-2">
            <li>Every video, resolution, or audio track will remain available or uninterrupted.</li>
            <li>Direct CDN URLs will remain valid indefinitely. Video delivery endpoints frequently incorporate expiring cryptographic tokens that invalidate links after a period of hours.</li>
            <li>Download speeds or server uptime will meet specific continuous benchmarks.</li>
          </ul>
        </section>

        {/* 5. Disclaimer of Warranties */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>5. Disclaimer of Warranties</span>
          </h2>
          <p className="bg-card p-4 rounded-xl border border-border text-xs text-gray-300 uppercase tracking-wide leading-relaxed">
            The service is provided &quot;as is&quot; and &quot;as available&quot;, without warranty of any kind, either express or implied, including without limitation warranties of merchantability, fitness for a particular purpose, non-infringement, or accuracy of information.
          </p>
        </section>

        {/* 6. Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall {siteConfig.name}, its creators, maintainers, or hosting affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from the use of or inability to use this service, or from any copyright dispute between users and content owners.
          </p>
        </section>

        {/* 7. Modifications and Termination */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">7. Modifications to Service and Terms</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice. We may likewise revise these Terms of Service periodically. Your continued use of the website following revisions constitutes acceptance of those changes.
          </p>
        </section>

        {/* 8. Contact Information */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">8. Contact Information</h2>
          <p>
            For questions regarding these terms, inquiries regarding DMCA notifications, or technical feedback, please contact:
          </p>
          <div className="p-4 rounded-xl bg-card border border-border text-xs font-mono text-gray-200">
            Email: <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary-cyan underline">{siteConfig.contactEmail}</a>
          </div>
        </section>
      </div>
    </div>
  );
}
