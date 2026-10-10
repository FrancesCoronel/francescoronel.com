"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { siteConfig } from "@/lib/metadata";

// Vercel Analytics and Speed Insights scripts are served by Vercel, so they
// 404 anywhere else (local builds, CI). The layout passes `vercel` from the
// server, where process.env.VERCEL is set.
export function AnalyticsProviders({ vercel = false }: { vercel?: boolean }) {
  const gaId = siteConfig.ga4MeasurementId;

  return (
    <>
      {vercel && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
