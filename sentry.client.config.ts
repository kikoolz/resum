import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampleRate for performance monitoring
  tracesSampleRate: 0,

  // Only capture errors, no performance traces (keeps costs at $0 for free tier)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Disable in development
  enabled: process.env.NODE_ENV === "production",

  // Don't report these error types
  ignoreErrors: [
    "AbortError",
    "ConsentInterrupted",
  ],
});
