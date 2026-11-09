// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));

vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/analytics")>()),
  trackEvent,
}));

import { AnalyticsEvents } from "./analytics-events";

function click(html: string) {
  document.body.innerHTML = html;
  const target = document.querySelector("[data-target]") ?? document.body.firstElementChild!;
  target.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

describe("AnalyticsEvents", () => {
  beforeEach(() => {
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

  it("stops listening after unmount", () => {
    cleanup();
    click('<a href="mailto:hello@francescoronel.com">Email</a>');
    expect(trackEvent).not.toHaveBeenCalled();
  });
});
