/**
 * Lightweight analytics tracker for funnel measurement.
 * Logs events to console in dev, can be wired to any backend.
 */

interface AnalyticsEvent {
  event: string;
  timestamp: number;
  properties?: Record<string, unknown>;
}

const EVENT_LOG_KEY = "lt-analytics-log";

function getLog(): AnalyticsEvent[] {
  try {
    return JSON.parse(localStorage.getItem(EVENT_LOG_KEY) || "[]");
  } catch {
    return [];
  }
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  const entry: AnalyticsEvent = {
    event,
    timestamp: Date.now(),
    properties,
  };

  // Console log in dev for debugging
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${event}`, properties || "");
  }

  // Store locally (keep last 200 events)
  try {
    const log = getLog();
    log.push(entry);
    if (log.length > 200) log.splice(0, log.length - 200);
    localStorage.setItem(EVENT_LOG_KEY, JSON.stringify(log));
  } catch { }
}

export function getAnalyticsLog(): AnalyticsEvent[] {
  return getLog();
}

// Pre-defined event names for type safety
export const Events = {
  APP_OPEN: "app_open",
  CLICK_GOOGLE_LOGIN: "click_google_login",
  CLICK_APPLE_LOGIN: "click_apple_login",
  LOGIN_SUCCESS: "login_success",
  LOGIN_ERROR: "login_error",
  PROFILE_CREATED: "profile_created",
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_COMPLETED: "onboarding_completed",
  ONBOARDING_SKIPPED: "onboarding_skipped",
  HOME_VIEW: "home_view",
  ITINERARY_CREATED: "itinerary_created",
  SAVE_PLACE: "save_place",
  PAYWALL_SHOWN: "paywall_shown",
  PAYWALL_CTA_CLICKED: "paywall_cta_clicked",
} as const;
