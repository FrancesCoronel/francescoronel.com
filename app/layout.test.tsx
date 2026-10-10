import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
// The search modal dynamically imports Pagefind's build output from /public, which Vite cannot resolve
vi.mock("@/components/ui/search-modal", () => ({ SearchModal: () => null }));
vi.mock("@vercel/analytics/next", () => ({ Analytics: () => <div data-testid="vercel-analytics" /> }));
vi.mock("@vercel/speed-insights/next", () => ({ SpeedInsights: () => <div data-testid="speed-insights" /> }));

async function loadLayout() {
  vi.resetModules();
  return import("./layout");
}

describe("RootLayout", () => {
  it("exports site metadata with icons, RSS alternate and verification", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION", "google-token");
    const { metadata } = await loadLayout();
    expect(metadata.title).toEqual({ default: "Frances Coronel", template: "%s | Frances Coronel" });
    expect(metadata.icons).toEqual({ icon: "/icon.png", apple: "/apple-icon.png" });
    expect(metadata.alternates).toEqual({ types: { "application/rss+xml": "/feed" } });
    expect(metadata.verification).toEqual({ google: "google-token" });
    expect(metadata.other).toEqual({ "llms.txt": "https://francescoronel.com/llms.txt" });
  });

  it("renders the document shell around the page content", async () => {
    vi.stubEnv("VERCEL", "");
    const { default: RootLayout } = await loadLayout();
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>Page body</p>
      </RootLayout>,
    );

    expect(html).toMatch(/^<html lang="en">/);
    expect(html).toContain('<link rel="me" href="https://github.com/FrancesCoronel"/>');
    expect(html).toContain('<link rel="me" href="https://bsky.app/profile/francescoronel.bsky.social"/>');
    for (const weight of ["medium", "bold", "heavy"]) {
      expect(html).toContain(`href="/fonts/latina-essential-${weight}.woff2"`);
    }
    expect(html).not.toContain("latina-essential-light.woff2");
    expect(html).toContain('<a href="#main-content"');
    expect(html).toContain('<main id="main-content" class="flex-1"><p>Page body</p></main>');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('"@type":"WebSite"');
    expect(html).toContain("<nav");
    expect(html).toContain("<footer");
    expect(html).not.toContain("vercel-analytics");
  });

  it("enables Vercel analytics when deployed on Vercel", async () => {
    vi.stubEnv("VERCEL", "1");
    const { default: RootLayout } = await loadLayout();
    const html = renderToStaticMarkup(<RootLayout>content</RootLayout>);
    expect(html).toContain('<div data-testid="vercel-analytics"></div>');
    expect(html).toContain('<div data-testid="speed-insights"></div>');
  });
});
