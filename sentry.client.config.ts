import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  // Session Replay is off: it shipped a large bundle to every visitor and recorded
  // unmasked page text. Error events and traces still report as before.
});
