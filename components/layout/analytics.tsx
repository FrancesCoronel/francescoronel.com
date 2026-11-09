"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Vercel Analytics and Speed Insights scripts are served by Vercel, so they
// 404 anywhere else (local builds, CI). The layout passes `vercel` from the
// server, where process.env.VERCEL is set.
export function AnalyticsProviders({ vercel = false }: { vercel?: boolean }) {
  if (!vercel) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
