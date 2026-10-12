/**
 * Google Analytics & Event Tracking Helper
 * Configurable via NEXT_PUBLIC_GA_MEASUREMENT_ID environment variable.
 * Privacy-friendly: Never sends sensitive personal, student, or admin credentials.
 */

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js",
      targetIdOrAction: string | Date,
      params?: Record<string, any>
    ) => void;
  }
}

/**
 * Log standard pageview to Google Analytics
 */
export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
}

export type AnalyticsEventCategory =
  | "course_view"
  | "contact_click"
  | "phone_click"
  | "enquiry_submit"
  | "feedback_submit"
  | "gallery_interaction";

/**
 * Log customized tracking event
 */
export function trackEvent(
  action: AnalyticsEventCategory,
  params?: {
    label?: string;
    value?: number;
    category?: string;
    [key: string]: any;
  }
) {
  if (typeof window !== "undefined" && window.gtag && GA_TRACKING_ID) {
    window.gtag("event", action, {
      event_category: params?.category || "engagement",
      event_label: params?.label,
      value: params?.value,
      ...params,
    });
  }
}
