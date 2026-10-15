import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@vercel/analytics/next", () => ({ Analytics: () => <div data-testid="vercel-analytics" /> }));
vi.mock("@vercel/speed-insights/next", () => ({ SpeedInsights: () => <div data-testid="speed-insights" /> }));
vi.mock("next/script", () => ({
  default: ({ src, id, strategy, children }: { src?: string; id?: string; strategy: string; children?: ReactNode }) => (
    <script async src={src} id={id} data-strategy={strategy}>
      {children}
    </script>
  ),
}));

async function loadAnalytics(gaId: string) {
  vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", gaId);
  vi.resetModules();
  return (await import("./analytics")).AnalyticsProviders;
}

describe("AnalyticsProviders", () => {
  it("renders nothing off Vercel without a GA4 id", async () => {
    const AnalyticsProviders = await loadAnalytics("");
    expect(renderToStaticMarkup(<AnalyticsProviders />)).toBe("");
  });

  it("renders Vercel Analytics and Speed Insights on Vercel", async () => {
    const AnalyticsProviders = await loadAnalytics("");
    const html = renderToStaticMarkup(<AnalyticsProviders vercel />);
    expect(html).toBe('<div data-testid="vercel-analytics"></div><div data-testid="speed-insights"></div>');
  });

  it("loads gtag and configures GA4 when an id is set", async () => {
    const AnalyticsProviders = await loadAnalytics("G-ABC123");
    const html = renderToStaticMarkup(<AnalyticsProviders />);
    expect(html).toContain(
      '<script async="" src="https://www.googletagmanager.com/gtag/js?id=G-ABC123" data-strategy="afterInteractive"></script>',
    );
    expect(html).toContain('id="ga4-init"');
    expect(html).toContain("gtag('config', 'G-ABC123');");
    expect(html).not.toContain("vercel-analytics");
  });
});
