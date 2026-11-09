import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@vercel/analytics/next", () => ({ Analytics: () => <div data-testid="vercel-analytics" /> }));
vi.mock("@vercel/speed-insights/next", () => ({ SpeedInsights: () => <div data-testid="speed-insights" /> }));

import { AnalyticsProviders } from "./analytics";

describe("AnalyticsProviders", () => {
  it("renders nothing off Vercel", () => {
    expect(renderToStaticMarkup(<AnalyticsProviders />)).toBe("");
  });

  it("renders Vercel Analytics and Speed Insights on Vercel", () => {
    expect(renderToStaticMarkup(<AnalyticsProviders vercel />)).toBe(
      '<div data-testid="vercel-analytics"></div><div data-testid="speed-insights"></div>',
    );
  });
});
