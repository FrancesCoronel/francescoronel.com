// Sentry loads after the page does (see instrumentation-client.ts), so error
// boundaries load it on demand instead of importing it into the main bundle.
export async function reportError(error: unknown) {
  await import("@/sentry.client.config");
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureException(error);
}
