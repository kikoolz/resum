import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only capture errors in production
  enabled: process.env.NODE_ENV === "production",

  // Adjust this value in production
  tracesSampleRate: 0,
});
