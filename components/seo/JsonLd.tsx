import React from 'react';
import { siteConfig } from '@/lib/config';

interface FAQItem {
  question: string;
  answer: string;
}

interface JsonLdProps {
  faqItems?: FAQItem[];
}

export const JsonLd: React.FC<JsonLdProps> = ({ faqItems }) => {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/?url={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteConfig.name,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires modern web browser with HTML5 and JavaScript support',
    url: siteConfig.url,
    description: siteConfig.description,
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    featureList: [
      'No watermark video download',
      'High definition MP4 conversion',
      'Original MP3 audio track extraction',
      'Mobile and desktop browser compatible',
      'Instant public link analysis',
    ],
  };

  const schemas: Record<string, unknown>[] = [websiteSchema, webAppSchema];

  if (faqItems && faqItems.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  // Safe stringification escaping angles to prevent XSS
  const serialized = JSON.stringify(schemas).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
};
