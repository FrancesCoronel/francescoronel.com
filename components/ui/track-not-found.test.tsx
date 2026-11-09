// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ trackEvent }));

import { TrackNotFound } from "./track-not-found";

afterEach(() => {
  cleanup();
  trackEvent.mockReset();
  window.history.replaceState(null, "", "/");
});

describe("TrackNotFound", () => {
  it("logs the missing path and referrer once, rendering nothing", () => {
    window.history.replaceState(null, "", "/posts/gone?ref=x");
    vi.spyOn(document, "referrer", "get").mockReturnValue("https://google.com/");
    const { container } = render(<TrackNotFound />);
    expect(container.innerHTML).toBe("");
    expect(trackEvent).toHaveBeenCalledExactlyOnceWith("page_not_found", {
      path: "/posts/gone?ref=x",
      referrer: "https://google.com/",
    });
  });

  it("leaves out an empty referrer", () => {
    vi.spyOn(document, "referrer", "get").mockReturnValue("");
    render(<TrackNotFound />);
    expect(trackEvent).toHaveBeenCalledWith("page_not_found", { path: "/", referrer: undefined });
  });
});
