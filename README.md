# TikTok Downloader — No Watermark

A production-grade, fast, mobile-first web application designed to retrieve and download publicly accessible TikTok videos in HD MP4 and MP3 formats without watermarks.

Engineered with Next.js 15 (App Router), TypeScript, Tailwind CSS, Zod schema validation, server-side SSRF protection, distributed rate-limiting abstraction, and a modular third-party provider integration architecture.

---

## Table of Contents

1. [Features](#features)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Environment Variables Setup](#environment-variables-setup)
6. [Obtaining & Configuring Provider API Credentials](#obtaining--configuring-provider-api-credentials)
7. [Running in Local Development](#running-in-local-development)
8. [Automated Testing](#automated-testing)
9. [Production Build](#production-build)
10. [Deployment Guide](#deployment-guide)
    - [Option A: Vercel (Recommended)](#option-a-vercel-recommended)
    - [Option B: Node.js VPS / Docker](#option-b-nodejs-vps--docker)
11. [HTTPS and Canonical Domain Setup](#https-and-canonical-domain-setup)
12. [Sitemap & Robots Verification](#sitemap--robots-verification)
13. [Google AdSense Integration Guide](#google-adsense-integration-guide)
14. [Production Rate Limiting & Security Hardening](#production-rate-limiting--security-hardening)
15. [Troubleshooting & Common Errors](#troubleshooting--common-errors)
16. [Legal & Permitted Use Disclaimer](#legal--permitted-use-disclaimer)

---

## Features

- **No Watermark Extraction:** Direct links to original-resolution MP4 video streams and MP3 audio tracks.
- **Client & Server URL Validation:** Validates standard TikTok URLs (`tiktok.com/@user/video/...`) and short links (`vm.tiktok.com`, `vt.tiktok.com`).
- **SSRF & Private Network Protection:** Blocks attempts to resolve localhost, loopback (`127.0.0.1`), RFC 1918 private subnets (`10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`), link-local metadata addresses (`169.254.169.254`), and non-TikTok hosts.
- **Controlled Short-Link Resolution:** Safely follows HTTP redirects for `vm.tiktok.com` short links with strict redirect limits and host validation at every hop.
- **Direct CDN Streaming:** Delivers temporary signed CDN download links straight from authorized content delivery networks—preventing heavy bandwidth proxying on your server.
- **Production Rate Limiting:** Includes an in-memory sliding window limiter for local dev and single servers, plus an atomic Upstash Redis REST adapter for distributed serverless deployments.
- **Google AdSense-Ready Layout:** Pre-configured `AdSlot` and `AdBanner` components in compliant locations with CLS prevention (layout shifts avoided). Ads remain dormant until a valid Publisher ID is provided.
- **Technical SEO Built-in:** Next.js Metadata API, dynamic `sitemap.ts`, `robots.ts`, Open Graph / Twitter cards, and structured JSON-LD schemas (`WebSite`, `WebApplication`, `FAQPage`).
- **Comprehensive Educational Content & FAQ:** 12 native `<details>`/`<summary>` accordion FAQ questions addressing mobile usage, link expiration, video privacy, and copyright rules.
- **Complete Legal Suite:** Dedicated Privacy Policy (`/privacy-policy`) and Terms of Service (`/terms`) pages with clear boundaries on fair use, copyright, and data privacy.

---

## Architecture Overview

```
tiktok-downloader/
├── app/
│   ├── api/download/route.ts      # Server-side API endpoint (POST validation, SSRF check, rate limit, provider extraction)
│   ├── privacy-policy/page.tsx    # Privacy Policy page
│   ├── terms/page.tsx             # Terms of Service page
│   ├── globals.css                # Tailwind base, dark palette, and custom animations
│   ├── layout.tsx                 # Root layout with SEO metadata, navbar, and footer
│   ├── page.tsx                   # Landing page: Hero, DownloaderForm, Ad Slots, Education & FAQ
│   ├── robots.ts                  # Dynamic robots.txt
│   └── sitemap.ts                 # Dynamic sitemap.xml
├── components/
│   ├── ads/
│   │   ├── AdSlot.tsx             # Reusable CLS-safe AdSense container
│   │   └── AdBanner.tsx           # Positioned banner slots (hero, sidebar, FAQ)
│   ├── downloader/
│   │   ├── DownloaderForm.tsx     # Reactive form with clipboard paste, validation, and error states
│   │   ├── LoadingState.tsx       # Shimmering skeleton loader during extraction
│   │   └── VideoResult.tsx        # Result card with video preview, format buttons, and copy actions
│   ├── layout/
│   │   ├── Navbar.tsx             # Responsive header with mobile drawer menu
│   │   └── Footer.tsx             # Comprehensive footer with legal disclaimer and nav
│   └── seo/
│       └── JsonLd.tsx             # Schema.org structured data (WebSite, WebApplication, FAQPage)
├── lib/
│   ├── config.ts                  # Centralized configuration and environment variable parsing
│   ├── validation.ts              # Zod schemas for request and response validation
│   ├── providers/
│   │   ├── index.ts               # Provider manager and multi-provider failover orchestrator
│   │   ├── rapidapi.ts            # RapidAPI TikTok adapter with header construction and response mapping
│   │   └── types.ts               # VideoProviderAdapter interface and ProviderError class
│   └── security/
│       ├── rate-limit.ts          # Memory and Upstash Redis rate limiters
│       └── url-validation.ts      # Host whitelisting, SSRF filters, and short-link redirect resolver
├── tests/                         # Vitest automated test suite (URL validation, rate limit, API, RapidAPI)
├── types/
│   └── video.ts                   # Core TypeScript domain types
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── vitest.config.ts
```

---

## Prerequisites

- **Node.js**: v18.18.0 or later (Node 20 or Node 22 LTS recommended, Node 24 supported).
- **Package Manager**: `npm`, `pnpm`, or `yarn`.
- **Operating System**: Windows (PowerShell or CMD), macOS, or Linux.

---

## Installation

1. Open your terminal or PowerShell console.
2. Navigate to your project directory:
   ```bash
   cd C:\Users\DELL\.gemini\antigravity\scratch\tiktok-downloader
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

## Environment Variables Setup

Create a `.env.local` file in the root of the project by copying `.env.example`:

### Windows PowerShell:
```powershell
Copy-Item .env.example .env.local
```

### macOS / Linux:
```bash
cp .env.example .env.local
```

### Environment Configuration Reference:

| Variable | Description | Default / Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL of your site (used for SEO, OG images, sitemap) | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_NAME` | Display name of the website | `TikTok Downloader` |
| `SITE_CONTACT_EMAIL` | Contact email displayed in Privacy Policy & Terms | `support@yourdomain.com` |
| `VIDEO_PROVIDER` | Active provider adapter | `rapidapi` |
| `RAPIDAPI_KEY` | Secret RapidAPI key from your RapidAPI dashboard | `your_actual_key_here` |
| `RAPIDAPI_HOST` | RapidAPI API host header | `tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com` |
| `RAPIDAPI_ENDPOINT` | RapidAPI endpoint URL | `https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/index` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `60000` (1 minute) |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests allowed per IP per window | `10` |
| `UPSTASH_REDIS_REST_URL` | (Optional) Upstash Redis REST endpoint for distributed rate limiting | `https://xxxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | (Optional) Upstash Redis REST bearer token | `your_token` |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | (Optional) Google AdSense publisher ID (leave blank until approved) | `ca-pub-XXXXXXXXXXXXXXXX` |

---

## Obtaining & Configuring Provider API Credentials

Because TikTok does not offer a public unauthenticated API for downloading clean watermark-free video streams, our system utilizes a modular adapter architecture connected to documented third-party providers.

To connect a live provider:

1. Create a free account at [RapidAPI.com](https://rapidapi.com/).
2. Search for a popular, maintained TikTok downloader API (for example: **TikTok Downloader - Download TikTok Videos Without Watermark** or **TikTok All In One**).
3. Subscribe to the API tier that fits your needs (many offer free tiers with 100–500 monthly requests).
4. Copy your **`X-RapidAPI-Key`** and **`X-RapidAPI-Host`** from the RapidAPI developer console.
5. In your `.env.local` file, set:
   ```env
   VIDEO_PROVIDER=rapidapi
   RAPIDAPI_KEY=1234567890abcdef1234567890abcdef
   RAPIDAPI_HOST=tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com
   RAPIDAPI_ENDPOINT=https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/index
   ```
6. Restart your development server.

> **Note:** If `RAPIDAPI_KEY` is not provided or set to a placeholder, the application gracefully returns a `503 PROVIDER_NOT_CONFIGURED` response with clear instructions on how to set it up, rather than fabricating fake videos or crashing.

---

## Running in Local Development

Start the development server with Hot Module Replacement (HMR):

### Windows (PowerShell or CMD):
```powershell
npm run dev
```

### macOS / Linux:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Automated Testing

The project includes an automated test suite built with **Vitest**. It verifies URL validation rules, SSRF blocking, rate-limit logic, mock RapidAPI parsing, and API error codes.

Run tests once:
```bash
npm test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

---

## Production Build

To verify compilation, TypeScript type-checking, CSS purging, and build optimization:

```bash
npm run build
```

To test the production build locally:
```bash
npm run start
```

---

## Deployment Guide

### Option A: Vercel (Recommended for Next.js)

1. Push your repository to GitHub, GitLab, or Bitbucket (make sure `.env.local` is **NOT** committed).
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your Git repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
   - `NEXT_PUBLIC_SITE_NAME` = `TikTok Downloader`
   - `SITE_CONTACT_EMAIL` = `support@yourdomain.com`
   - `RAPIDAPI_KEY` = `<your-rapidapi-key>`
   - `RAPIDAPI_HOST` = `<your-rapidapi-host>`
   - `RAPIDAPI_ENDPOINT` = `<your-rapidapi-endpoint>`
   - `UPSTASH_REDIS_REST_URL` = (Optional for distributed rate-limiting)
   - `UPSTASH_REDIS_REST_TOKEN` = (Optional for distributed rate-limiting)
5. Click **Deploy**. Vercel will automatically build and distribute the app across global edge nodes.

---

### Option B: Node.js VPS / Docker

If deploying to an Ubuntu/Debian VPS with PM2 and Nginx:

1. Clone your repo onto the server.
2. Create `.env.local` with your production variables.
3. Install dependencies and build:
   ```bash
   npm ci
   npm run build
   ```
4. Start with PM2:
   ```bash
   pm2 start npm --name "tiktok-downloader" -- start
   pm2 save
   ```
5. Configure Nginx as a reverse proxy:
   ```nginx
   server {
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## HTTPS and Canonical Domain Setup

1. Point your domain's DNS `A` or `CNAME` records to your hosting provider.
2. Obtain an SSL certificate using Let's Encrypt / Certbot:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
3. Update `NEXT_PUBLIC_SITE_URL` in your server environment variables to `https://yourdomain.com` so canonical tags, Open Graph meta tags, and sitemaps reference your live domain.

---

## Sitemap & Robots Verification

Once deployed, verify your SEO endpoints directly:

- **Sitemap**: `https://yourdomain.com/sitemap.xml`
- **Robots**: `https://yourdomain.com/robots.txt`

Submit `https://yourdomain.com/sitemap.xml` to [Google Search Console](https://search.google.com/search-console) to index all primary and legal pages.

---

## Google AdSense Integration Guide

The codebase is pre-configured for Google AdSense with CLS (Cumulative Layout Shift) protection:

1. Apply for an account at [Google AdSense](https://adsense.google.com).
2. Once your domain is approved, obtain your Publisher ID (e.g., `ca-pub-1234567890123456`).
3. Add the following to `.env.local`:
   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
   ```
4. In `app/layout.tsx`, add the official Google AdSense script tag inside `<head>`:
   ```html
   <script
     async
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"
   ></script>
   ```
5. In `components/ads/AdSlot.tsx`, uncomment the `<ins className="adsbygoogle" ... />` block.

---

## Production Rate Limiting & Security Hardening

- **Memory Limiter:** Enabled by default. Ideal for local development or single-instance VPS deployments.
- **Upstash Redis Distributed Limiter:** For multi-region serverless deployments (Vercel, AWS Lambda), add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. The system automatically switches to atomic Redis pipeline commands (`INCR`, `EXPIRE`, `TTL`) without code changes.
- **SSRF Prevention:** Enforces strict domain whitelists and blocks IP addresses in RFC 1918 ranges, link-local metadata addresses (`169.254.169.254`), and loopback addresses.

---

## Troubleshooting & Common Errors

| Issue | Cause | Resolution |
|---|---|---|
| `503 PROVIDER_NOT_CONFIGURED` | Missing `RAPIDAPI_KEY` in environment variables | Add a valid RapidAPI key to `.env.local` or hosting provider settings. |
| `429 Too many requests` | Client exceeded maximum requests per minute | Wait 60 seconds or increase `RATE_LIMIT_MAX_REQUESTS` in `.env.local`. |
| `400 UNSUPPORTED_HOST` | Non-TikTok URL submitted (e.g., YouTube or Instagram) | Enter a valid TikTok link (`tiktok.com` or `vm.tiktok.com`). |
| `404 VIDEO_NOT_FOUND` | Video is private, removed, or region-restricted | Verify that the video is public and accessible in an incognito window. |
| `504 PROVIDER_TIMEOUT` | Upstream provider took longer than 12 seconds | Check RapidAPI status and retry your request. |
| `Clipboard access denied` | Browser blocked clipboard read permission | Paste the URL manually into the input box using `Ctrl+V` or long-press. |

---

## Legal & Permitted Use Disclaimer

**TikTok Downloader** is an independent web application and is not affiliated with, sponsored by, or endorsed by TikTok or ByteDance Ltd.

All trademarks, logos, and copyrights belong to their respective owners. This service is designed strictly for personal, non-commercial archiving and fair-use educational purposes of publicly accessible content. Users are solely responsible for ensuring they possess the necessary rights or creator permission before downloading or reusing any media.
