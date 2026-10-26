/**
 * Configurable Site URL Helper for Production, Staging, and Local Development
 * Avoids hardcoding domains across Next.js metadata, sitemaps, robots, and OpenGraph.
 */
export function getSiteUrl(): string {
  // 1. Configured custom production domain
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (configuredUrl) {
    return configuredUrl.trim().replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    return "https://www.meddrainnhealthcare.in";
  }

  // 2. Default fallback for local development
  return "http://localhost:3000";
}

/**
 * Returns a fully qualified absolute URL for canonical tags, sitemaps, and OpenGraph images.
 */
export function getAbsoluteUrl(path = "/"): string {
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
