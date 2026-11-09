// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackEvent, vitals, nav } = vi.hoisted(() => ({
  trackEvent: vi.fn(),
  vitals: { report: undefined as undefined | ((m: Record<string, unknown>) => void) },
  nav: { pathname: "/posts/hello" },
}));

vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/analytics")>()),
  trackEvent,
}));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));
vi.mock("next/web-vitals", () => ({
  useReportWebVitals: (cb: (m: Record<string, unknown>) => void) => {
    vitals.report = cb;
  },
}));

import { AnalyticsEvents } from "./analytics-events";

function setPage(scrollHeight: number, innerHeight: number) {
  Object.defineProperty(document.documentElement, "scrollHeight", { value: scrollHeight, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: innerHeight, configurable: true });
}

function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  window.dispatchEvent(new Event("scroll"));
}

function click(html: string) {
  document.body.innerHTML = html;
  const target = document.querySelector("[data-target]") ?? document.body.firstElementChild!;
  target.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

describe("AnalyticsEvents", () => {
  beforeEach(() => {
    nav.pathname = "/posts/hello";
    render(<AnalyticsEvents />);
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
    trackEvent.mockReset();
  });

  it("renders nothing", () => {
    cleanup();
    const { container } = render(<AnalyticsEvents />);
    expect(container.innerHTML).toBe("");
  });

  it("tracks outbound link clicks with their text and page", () => {
    // jsdom has no layout; stop it trying to navigate
    document.addEventListener("click", (e) => e.preventDefault(), { once: true });
    click('<a href="https://github.com/FrancesCoronel"><span data-target> GitHub </span></a>');
    expect(trackEvent).toHaveBeenCalledWith("outbound_click", {
      domain: "github.com",
      url: "https://github.com/FrancesCoronel",
      link_text: "GitHub",
      page: "/",
    });
  });

  it("tracks downloads marked with the download attribute, without empty link text", () => {
    document.addEventListener("click", (e) => e.preventDefault(), { once: true });
    click('<a href="/images/photo.png" download><img alt="" /></a>');
    expect(trackEvent).toHaveBeenCalledWith("file_download", {
      file_name: "photo.png",
      url: "http://localhost:3000/images/photo.png",
      link_text: undefined,
      page: "/",
    });
  });

  it("ignores internal links and clicks outside links", () => {
    document.addEventListener("click", (e) => e.preventDefault(), { once: true });
    click('<a href="/about">About</a>');
    click("<button>Menu</button>");
    document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("tracks each scroll depth mark once per page, GA4 only", () => {
    setPage(3000, 1000);
    scrollTo(500); // 25%
    scrollTo(1000); // 50%
    scrollTo(1000);
    scrollTo(2000); // 100%, also passes 75%
    expect(trackEvent.mock.calls).toEqual([
      ["scroll_depth", { percent: 25, page: "/posts/hello" }, { vercel: false }],
      ["scroll_depth", { percent: 50, page: "/posts/hello" }, { vercel: false }],
      ["scroll_depth", { percent: 75, page: "/posts/hello" }, { vercel: false }],
      ["scroll_depth", { percent: 100, page: "/posts/hello" }, { vercel: false }],
    ]);
  });

  it("ignores scrolling on pages shorter than the window", () => {
    setPage(800, 1000);
    scrollTo(0);
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("stops listening after unmount", () => {
    cleanup();
    setPage(3000, 1000);
    scrollTo(2000);
    click('<a href="mailto:hello@francescoronel.com">Email</a>');
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("reports web vitals to GA4, scaling CLS", () => {
    vitals.report!({ name: "LCP", value: 1234.6, rating: "good", id: "v1" });
    vitals.report!({ name: "CLS", value: 0.0123, rating: "good", id: "v2" });
    expect(trackEvent.mock.calls).toEqual([
      ["web_vitals", { metric_name: "LCP", metric_value: 1235, metric_rating: "good", metric_id: "v1" }, { vercel: false }],
      ["web_vitals", { metric_name: "CLS", metric_value: 12, metric_rating: "good", metric_id: "v2" }, { vercel: false }],
    ]);
  });
});
