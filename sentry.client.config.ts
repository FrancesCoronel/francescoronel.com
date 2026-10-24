import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Inlined from VERCEL_ENV in next.config.ts (production, preview or
  // development), so production-only alerts skip preview deploys.
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  // Session Replay is off: it shipped a large bundle to every visitor and recorded
  // unmasked page text. Error events and traces still report as before.

  // Errors thrown by browser extensions and link scanners, not by the site.
  // Left in, they open new issues and fire alerts for nothing we can fix.
  ignoreErrors: [
    "Object Not Found Matching Id",
    "Invalid call to runtime.sendMessage()",
    "window.__KVARS__",
    "reading 'M_ID'",
    "chrome.storage",
  ],
  denyUrls: [/^chrome-extension:\/\//, /^moz-extension:\/\//, /^safari-(web-)?extension:\/\//],
});
