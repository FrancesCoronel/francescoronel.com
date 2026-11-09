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

  it("works without gtag", () => {
    vi.stubGlobal("window", {});
    expect(() => trackEvent("ping")).not.toThrow();
    expect(track).toHaveBeenCalledOnce();
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
