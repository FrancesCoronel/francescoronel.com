import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { track } = vi.hoisted(() => ({ track: vi.fn() }));
vi.mock("@vercel/analytics", () => ({ track }));

import { classifyLink, trackEvent } from "./analytics";

const ORIGIN = "https://francescoronel.com";

describe("trackEvent", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {});
  });

  afterEach(() => track.mockReset());

  it("sends the event to Vercel, dropping undefined props", () => {
    trackEvent("search", { search_term: "ai", results: 3, selected_url: undefined, ok: true, x: null });
    expect(track).toHaveBeenCalledWith("search", { search_term: "ai", results: 3, ok: true, x: null });
  });

  it("defaults to no props", () => {
    trackEvent("ping");
    expect(track).toHaveBeenCalledWith("ping", {});
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
    vi.stubGlobal("window", { va });
    trackEvent("ping");
    expect((window as unknown as { va: unknown }).va).toBe(va);
  });

  it("never throws when Vercel Analytics fails", () => {
    track.mockImplementation(() => {
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
