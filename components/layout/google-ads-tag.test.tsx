import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/script", () => ({
  default: ({ id, src, strategy, children }: { id: string; src?: string; strategy: string; children?: ReactNode }) => (
    <script id={id} data-src={src} data-strategy={strategy}>
      {children}
    </script>
  ),
}));

import { BOOKING_PARAMS_SCRUB, BookingParamsScrub, GOOGLE_TAG_ID, GoogleAdsTag, googleAdsTagEnabled } from "./google-ads-tag";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GoogleAdsTag", () => {
  it("renders nothing unless enabled", () => {
    expect(renderToStaticMarkup(<GoogleAdsTag />)).toBe("");
    expect(renderToStaticMarkup(<GoogleAdsTag purchase={{ halfHour: 30, hour: 65 }} />)).toBe("");
  });

  it("loads the Google tag lazily without a purchase event on the landing page", () => {
    const html = renderToStaticMarkup(<GoogleAdsTag enabled />);
    expect(html).toContain(`data-src="https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_ID}"`);
    expect(html).toContain('data-strategy="lazyOnload"');
    expect(html).toContain("window.dataLayer=window.dataLayer||[]");
    expect(html).not.toContain("purchase");
  });

  it("reports a purchase priced by session length on the thank-you page", () => {
    const html = renderToStaticMarkup(<GoogleAdsTag enabled purchase={{ halfHour: 30, hour: 65 }} />);
    expect(html).toContain("gtag('event','purchase'");
    expect(html).toContain("value:b.minutes>=60?65:30,currency:'USD'");
    expect(html).toContain("sessionStorage");
    // No booking uid means no purchase: direct visits must not count as sales
    expect(html).toContain("if(!uid)return;");
    expect(html).not.toContain("Date.now()");
  });

  it("renders the scrub as an inline script that removes the query string", () => {
    expect(renderToStaticMarkup(<BookingParamsScrub />)).toBe(`<script>${BOOKING_PARAMS_SCRUB}</script>`);
    expect(BOOKING_PARAMS_SCRUB).toContain("history.replaceState(history.state,'',location.pathname)");
    expect(BOOKING_PARAMS_SCRUB).not.toContain("email");
  });

  it("is enabled only on the Vercel production deployment", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(googleAdsTagEnabled()).toBe(false);
    vi.stubEnv("VERCEL_ENV", "production");
    expect(googleAdsTagEnabled()).toBe(true);
  });
});
