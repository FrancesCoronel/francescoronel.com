import { describe, expect, it } from "vitest";
import { canOptimize, cn, formatDate, formatDateRange, OPTIMIZED_HOSTS, slugify, truncate } from "./utils";

describe("canOptimize", () => {
  it("accepts local raster images", () => {
    expect(canOptimize("/images/photo.png")).toBe(true);
    expect(canOptimize("/images/photo.JPEG")).toBe(true);
    expect(canOptimize("/a/b.webp")).toBe(true);
    expect(canOptimize("/a/b.avif")).toBe(true);
  });

  it("rejects local SVGs, query strings and protocol-relative URLs", () => {
    expect(canOptimize("/images/logo.svg")).toBe(false);
    expect(canOptimize("/images/photo.png?v=1")).toBe(false);
    expect(canOptimize("//evil.com/x.png")).toBe(false);
  });

  it("accepts only allowlisted remote hosts", () => {
    expect(OPTIMIZED_HOSTS.has("github.com")).toBe(true);
    expect(canOptimize("https://gzqhczl3ehdy3foa.public.blob.vercel-storage.com/a.png")).toBe(true);
    expect(canOptimize("https://example.com/a.png")).toBe(false);
  });

  it("returns false for unparseable URLs", () => {
    expect(canOptimize("not a url")).toBe(false);
  });
});

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", false, null, "b", { c: true, d: false }, ["e"])).toBe("a b c e");
  });
});

describe("formatDate", () => {
  it("formats a date-only string without timezone drift", () => {
    expect(formatDate("2024-03-01")).toBe("March 1, 2024");
  });
});

describe("formatDateRange", () => {
  it("formats an open-ended range as Present", () => {
    expect(formatDateRange("2022-01-15T12:00:00", null)).toBe("Jan 2022 – Present");
  });

  it("formats a closed range", () => {
    expect(formatDateRange("2020-06-15T12:00:00", "2021-08-15T12:00:00")).toBe("Jun 2020 – Aug 2021");
  });
});

describe("truncate", () => {
  it("returns short strings unchanged", () => {
    expect(truncate("short", 10)).toBe("short");
    expect(truncate("exactly10!", 10)).toBe("exactly10!");
  });

  it("cuts long strings, trims trailing space and adds an ellipsis", () => {
    expect(truncate("hello world again", 6)).toBe("hello...");
  });
});

describe("slugify", () => {
  it("creates URL-safe slugs", () => {
    expect(slugify("  Hello, World! ")).toBe("hello-world");
    expect(slugify("snake_case and  spaces")).toBe("snake-case-and-spaces");
    expect(slugify("--Leading & trailing--")).toBe("leading-trailing");
  });
});
