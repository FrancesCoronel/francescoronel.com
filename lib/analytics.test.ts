import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { track } = vi.hoisted(() => ({ track: vi.fn() }));
vi.mock("@vercel/analytics", () => ({ track }));

import { classifyLink, trackEvent } from "./analytics";

const ORIGIN = "https://francescoronel.com";

describe("trackEvent", () => {
  let gtag: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
  });

  afterEach(() => track.mockReset());

  it("sends the event to Vercel and GA4, dropping undefined props", () => {
    trackEvent("search", { search_term: "ai", results: 3, selected_url: undefined, ok: true, x: null });
    const expected = { search_term: "ai", results: 3, ok: true, x: null };
    expect(track).toHaveBeenCalledWith("search", expected);
    expect(gtag).toHaveBeenCalledWith("event", "search", expected);
  });

  it("defaults to no props", () => {
    trackEvent("ping");
    expect(track).toHaveBeenCalledWith("ping", {});
    expect(gtag).toHaveBeenCalledWith("event", "ping", {});
  });

  it("skips Vercel when asked", () => {
    trackEvent("scroll_depth", { percent: 50 }, { vercel: false });
    expect(track).not.toHaveBeenCalled();
    expect(gtag).toHaveBeenCalledWith("event", "scroll_depth", { percent: 50 });
  });

  describe("before gtag loads", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.stubGlobal("window", {});
    });
    afterEach(() => {
      // Let any held events time out so the next test starts clean
      vi.advanceTimersByTime(10_000);
      vi.useRealTimers();
    });

    it("still sends to Vercel", () => {
      expect(() => trackEvent("ping")).not.toThrow();
      expect(track).toHaveBeenCalledOnce();
    });

    it("holds GA4 events and sends them in order once gtag exists", () => {
      trackEvent("page_not_found", { path: "/x" });
      trackEvent("web_vitals", { metric_name: "TTFB" }, { vercel: false });
      vi.advanceTimersByTime(500);

      const late = vi.fn();
      (window as unknown as { gtag: typeof late }).gtag = late;
      vi.advanceTimersByTime(250);
      expect(late.mock.calls).toEqual([
        ["event", "page_not_found", { path: "/x" }],
        ["event", "web_vitals", { metric_name: "TTFB" }],
      ]);

      // Later events go straight through, and nothing is sent twice
      trackEvent("search");
      vi.advanceTimersByTime(1_000);
      expect(late).toHaveBeenCalledTimes(3);
      expect(late).toHaveBeenLastCalledWith("event", "search", {});
    });

    it("gives up after 10 seconds without gtag", () => {
      trackEvent("ping");
      vi.advanceTimersByTime(10_000);
      const late = vi.fn();
      (window as unknown as { gtag: typeof late }).gtag = late;
      vi.advanceTimersByTime(1_000);
      expect(late).not.toHaveBeenCalled();
    });

    it("keeps going if gtag throws while flushing", () => {
      trackEvent("a");
      trackEvent("b");
      const late = vi.fn(() => {
        throw new Error("blocked");
      });
      (window as unknown as { gtag: typeof late }).gtag = late;
      expect(() => vi.advanceTimersByTime(250)).not.toThrow();
      expect(late).toHaveBeenCalledTimes(2);
    });
  });

  it("creates the Vercel queue so events sent before the script loads aren't lost", () => {
    const w = window as unknown as { va: (...p: unknown[]) => void; vaq: unknown[][] };
    trackEvent("page_not_found");
    w.va("event", { name: "a" });
    w.va("event", { name: "b" });
    expect(w.vaq).toEqual([
      ["event", { name: "a" }],
      ["event", { name: "b" }],
    ]);
  });

  it("keeps an existing Vercel queue or loaded script", () => {
    const va = vi.fn();
    vi.stubGlobal("window", { gtag, va });
    trackEvent("ping");
    expect((window as unknown as { va: unknown }).va).toBe(va);
  });

  it("leaves the Vercel queue alone for GA4-only events", () => {
    trackEvent("scroll_depth", {}, { vercel: false });
    expect((window as unknown as { va?: unknown }).va).toBeUndefined();
  });

  it("never throws when either backend fails", () => {
    track.mockImplementation(() => {
      throw new Error("blocked");
    });
    gtag.mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => trackEvent("ping")).not.toThrow();
  });
});

describe("classifyLink", () => {
  it.each([
    ["mailto:hello@francescoronel.com", "contact_click", { method: "email" }],
    ["tel:+15555550100", "contact_click", { method: "phone" }],
    [
      "https://github.com/FrancesCoronel",
      "outbound_click",
      { domain: "github.com", url: "https://github.com/FrancesCoronel" },
    ],
    [
      "/files/resume.pdf",
      "file_download",
      { file_name: "resume.pdf", url: "https://francescoronel.com/files/resume.pdf" },
    ],
    [
      "https://example.com/deck.PPTX?dl=1",
      "file_download",
      { file_name: "deck.PPTX", url: "https://example.com/deck.PPTX?dl=1" },
    ],
  ])("%s -> %s", (href, name, props) => {
    expect(classifyLink(href, ORIGIN)).toEqual({ name, props });
  });

  it("treats a link with the download attribute as a download", () => {
    expect(classifyLink("/images/photo.png", ORIGIN, { download: true })).toEqual({
      name: "file_download",
      props: { file_name: "photo.png", url: "https://francescoronel.com/images/photo.png" },
    });
  });

  it.each(["/posts/foo", "#section", `${ORIGIN}/about`, "javascript:void(0)", "http://[bad"])(
    "ignores %s",
    (href) => {
      expect(classifyLink(href, ORIGIN)).toBeNull();
    },
  );
});
