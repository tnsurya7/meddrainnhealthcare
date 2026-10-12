# Meddrainn Healthcare — Production Full-Stack Web Platform

A production-ready full-stack biomedical training institute web platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Lucide React**, **Neon PostgreSQL Database**, **Neon Object Storage**, **Drizzle ORM**, and **Vercel**.

---

## 🏛️ Official Institute Information

- **Institute Name:** Meddrainn Healthcare
- **Established:** 2021
- **Campus Address:** H-42, 80 Feet Road, Periyar Nagar, Erode - 638001, Tamil Nadu, India.
- **Phone / WhatsApp:** +91 6380918863 (click-to-call enabled across mobile & desktop)
- **Email:** meddrainnhealthcare2019@gmail.com
- **Instagram:** [https://www.instagram.com/meddrainnhealthcare/](https://www.instagram.com/meddrainnhealthcare/)
- **Core Specialization:** Hands-on medical equipment calibration, healthcare sales and marketing programs, biomedical technology training, hospital internships, implant programs, workshops, seminars, and medical coding.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript | Server Components by default, responsive design (320px–1920px), Lucide React icons |
| **Styling** | Tailwind CSS 4 | Curated healthcare theme (`#10243A`, `#155EEF`, `#0D9488`, `#38BDF8`), accessible contrast, mobile-friendly layouts |
| **Database** | Neon PostgreSQL | Drizzle ORM, Drizzle Kit migrations, pooled serverless connection (`neondb`) |
| **Object Storage** | Neon Object Storage (`@aws-sdk/client-s3`) | S3-compatible path-style addressing (`forcePathStyle: true`), category namespaces, magic byte validation |
| **Security & Auth** | Argon2id (`@node-rs/argon2`) + Jose JWT | 64MB memory cost Argon2id hashing, signed JWTs, HttpOnly `SameSite=Lax` cookies, show/hide eye password toggle |
| **SEO & Discoverability** | Next.js Metadata API, Schema.org JSON-LD | OpenGraph, Twitter Cards, dynamic sitemap, robots.txt with `OAI-SearchBot` and `Googlebot` support |
| **Validation** | Zod 4 + React Hook Form | Strict schema validation, anti-spam honeypot, IP rate limiting |
| **Deployment** | Vercel | Zero-cold-start edge middleware, ISR caching (60s revalidation), serverless API handlers |

---

## 🌐 Custom Domain & Production URL Configuration

The application never hardcodes domains. It dynamically derives canonical URLs, sitemaps, OpenGraph cards, and schema definitions from environment variables.

### Environment Variable:
```bash
NEXT_PUBLIC_SITE_URL="https://meddrainnhealthcare.in"
```

### Supported Custom Domains:
- **Primary / Canonical:** `https://meddrainnhealthcare.in`
- **Alternative:** `https://meddrainnhealthcare.com`

---

## ⚙️ Vercel Custom Domain Configuration

1. **Add Custom Domain to Vercel Project:**
   - Go to your Vercel Dashboard -> Select project -> **Settings** -> **Domains**.
   - Add `meddrainnhealthcare.in` and `www.meddrainnhealthcare.in`.
   - Set `meddrainnhealthcare.in` as the **Canonical Domain**.
   - Configure `www.meddrainnhealthcare.in` to **Redirect** to `meddrainnhealthcare.in` (308 Permanent Redirect).

2. **DNS Record Setup (At Domain Registrar e.g. GoDaddy / Namecheap):**
   - **Apex Domain (`@`):**
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21` (Vercel Anycast IP)
   - **WWW Subdomain:**
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`

3. **Alternative Domain Setup (`meddrainnhealthcare.com`):**
   - If also purchased, add `meddrainnhealthcare.com` in Vercel Domains and configure it to **Redirect to `meddrainnhealthcare.in`**.
   - This prevents duplicate content penalties and consolidates SEO domain authority.

4. **Automatic SSL / HTTPS:**
   - Vercel automatically issues and renews Let's Encrypt SSL certificates.
   - HTTP requests are automatically redirected to HTTPS.

---

## 🤖 AI Search & ChatGPT Discoverability

The platform is designed to be easily discovered and crawled by AI search engines, including **ChatGPT Search (OAI-SearchBot)**, **Perplexity**, and **Google Gemini**:

1. **`robots.txt` Configuration (`/robots.txt`):**
   ```txt
   User-Agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /api/

   User-Agent: OAI-SearchBot
   Allow: /
   Disallow: /admin/
   Disallow: /api/

   User-Agent: Googlebot
   Allow: /
   Disallow: /admin/
   Disallow: /api/

   Sitemap: https://meddrainnhealthcare.in/sitemap.xml
   ```

2. **Server-Side Rendered (SSR) & Static HTML:**
   - Essential facts (Institute history, 2021 founding, mission, vision, 9 core services, course descriptions, Erode address, and phone number) are rendered in initial HTML — not hidden behind client-only JavaScript states.

3. **Structured Data (JSON-LD):**
   - Injected in HTML `<head>` using standard Schema.org types:
     - `EducationalOrganization`: Institute identity, official address, telephone, email, and social profiles.
     - `WebSite`: Publisher linkage.
     - `Course`: Individual course detail schemas for each published program.
     - `BreadcrumbList`: Hierarchical navigational context.

---

## 🔍 Google Search Console Setup

Follow this sequence to index Meddrainn Healthcare on Google Search:

1. **Add Property:**
   - Go to [Google Search Console](https://search.google.com/search-console).
   - Click **Add Property** -> Select **Domain** property type.
   - Enter `meddrainnhealthcare.in`.
2. **DNS Verification:**
   - Copy the `google-site-verification=...` TXT record provided by Google.
   - Add this TXT record at your DNS registrar.
   - Click **Verify** in Google Search Console.
3. **Submit Sitemap:**
   - Go to **Sitemaps** in the left sidebar.
   - Enter `sitemap.xml` and click **Submit**.
   - Verify that Google reports `Success` with all discovered URLs.
4. **URL Inspection & Live Test:**
   - Use the top search bar to inspect `https://meddrainnhealthcare.in`.
   - Click **Test Live URL** -> Confirm mobile friendliness and valid schema detection.
   - Click **Request Indexing**.
5. **Inspect Key Course Pages:**
   - Inspect individual URLs (e.g. `/courses`, `/services`, `/about`) to request prioritized indexing.
6. **Performance Monitoring:**
   - Check the **Performance** tab weekly to review clicks, impressions, CTR, and search queries (e.g., *"Biomedical training institute in Erode"*, *"Medical equipment training Erode"*).

---

## 📍 Google Business Profile Setup Checklist

To rank in Google Maps and local search for *"Biomedical training institute in Erode"*:

1. **Sign In / Create Profile:**
   - Go to [Google Business Profile](https://business.google.com/create).
   - Business Name: **Meddrainn Healthcare**
2. **Business Category:**
   - Primary Category: **Training Centre** or **Educational Institution**
   - Secondary Category: **Vocational Training School** / **Medical Equipment Supplier**
3. **Location & Contact (Must match website exactly):**
   - Address: `H-42, 80 Feet Road, Periyar Nagar, Erode - 638001, Tamil Nadu, India.`
   - Phone: `+91 6380918863`
   - Website URL: `https://meddrainnhealthcare.in`
4. **Business Hours:**
   - Monday – Saturday: `9:30 AM – 6:00 PM`
   - Sunday: `Closed`
5. **Verification:**
   - Complete Google's official phone/video/postcard verification.
6. **Photographs & Description:**
   - Add high-quality laboratory photos matching the website gallery.
   - Use the official institute introduction in the description field.

---

## 📊 Analytics & Event Tracking

Google Analytics 4 is integrated via `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

To enable:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### Tracked Events:
- `course_view`: When a visitor explores a course detail page.
- `contact_click`: When a visitor clicks admission enquiry buttons.
- `phone_click`: When a visitor clicks click-to-call telephone links.
- `enquiry_submit`: When an admission form is received.
- `feedback_submit`: When a student feedback review is submitted.

---

## 🚀 Local Development & Production Verification

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests (30 tests)
npm test

# 3. Check TypeScript compilation (0 errors)
npx tsc --noEmit

# 4. Run Next.js production build
npm run build

# 5. Start development server
npm run dev
```
