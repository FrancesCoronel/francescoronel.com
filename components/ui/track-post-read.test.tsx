// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ trackEvent }));

import { TrackPostRead } from "./track-post-read";

function setPage(scrollHeight: number, innerHeight: number) {
  Object.defineProperty(document.documentElement, "scrollHeight", { value: scrollHeight, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: innerHeight, configurable: true });
}

function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  window.dispatchEvent(new Event("scroll"));
}

afterEach(() => {
  cleanup();
  trackEvent.mockReset();
});

describe("TrackPostRead", () => {
  it("renders nothing", () => {
    const { container } = render(<TrackPostRead page="/posts/hello" />);
    expect(container.innerHTML).toBe("");
  });

  it("logs the post as read once, at 90% of the way down", () => {
    render(<TrackPostRead page="/posts/hello" />);
    setPage(3000, 1000);
    scrollTo(1000); // 50%
    scrollTo(1700); // 85%
    expect(trackEvent).not.toHaveBeenCalled();
    scrollTo(1800); // 90%
    scrollTo(2000);
    expect(trackEvent.mock.calls).toEqual([["post_read", { page: "/posts/hello" }]]);
  });

  it("ignores scrolling on posts shorter than the window", () => {
    render(<TrackPostRead page="/posts/hello" />);
    setPage(800, 1000);
    scrollTo(0);
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("stops listening after unmount", () => {
    render(<TrackPostRead page="/posts/hello" />);
    cleanup();
    setPage(3000, 1000);
    scrollTo(2000);
    expect(trackEvent).not.toHaveBeenCalled();
  });
});
