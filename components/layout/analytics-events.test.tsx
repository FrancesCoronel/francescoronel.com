// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackEvent, nav } = vi.hoisted(() => ({
  trackEvent: vi.fn(),
  nav: { pathname: "/posts/hello" },
}));

vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/analytics")>()),
  trackEvent,
}));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

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

  it("logs a post as read once, at 90% of the way down", () => {
    setPage(3000, 1000);
    scrollTo(1000); // 50%
    scrollTo(1700); // 85%
    expect(trackEvent).not.toHaveBeenCalled();
    scrollTo(1800); // 90%
    scrollTo(2000);
    expect(trackEvent.mock.calls).toEqual([["post_read", { page: "/posts/hello" }]]);
  });

  it.each(["/posts", "/about", "/posts/hello/extra"])("doesn't log reads on %s", (path) => {
    cleanup();
    nav.pathname = path;
    render(<AnalyticsEvents />);
    setPage(3000, 1000);
    scrollTo(2000);
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("ignores scrolling on posts shorter than the window", () => {
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
});
