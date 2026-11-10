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

import { GOOGLE_TAG_ID, GoogleAdsTag, googleAdsTagEnabled } from "./google-ads-tag";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GoogleAdsTag", () => {
  it("renders nothing unless enabled", () => {
    expect(renderToStaticMarkup(<GoogleAdsTag />)).toBe("");
    expect(renderToStaticMarkup(<GoogleAdsTag purchaseValue={30} />)).toBe("");
  });

  it("loads the Google tag lazily without a purchase event on the landing page", () => {
    const html = renderToStaticMarkup(<GoogleAdsTag enabled />);
    expect(html).toContain(`data-src="https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_ID}"`);
    expect(html).toContain('data-strategy="lazyOnload"');
    expect(html).toContain("window.dataLayer=window.dataLayer||[]");
    expect(html).not.toContain("purchase");
  });

  it("reports a purchase with the booking value on the thank-you page", () => {
    const html = renderToStaticMarkup(<GoogleAdsTag enabled purchaseValue={30} />);
    expect(html).toContain("gtag('event','purchase'");
    expect(html).toContain("value:30,currency:'USD'");
    expect(html).toContain("sessionStorage");
  });

  it("is enabled only on the Vercel production deployment", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(googleAdsTagEnabled()).toBe(false);
    vi.stubEnv("VERCEL_ENV", "production");
    expect(googleAdsTagEnabled()).toBe(true);
  });
});
