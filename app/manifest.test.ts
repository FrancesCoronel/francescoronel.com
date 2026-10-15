import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/metadata";
import manifest from "./manifest";

describe("manifest", () => {
  it("describes the site as a standalone app with the brand colors", () => {
    const result = manifest();
    expect(result).toMatchObject({
      name: siteConfig.title,
      short_name: "Frances",
      description: siteConfig.description,
      start_url: "/",
      display: "standalone",
      background_color: "#f9f5f3",
      theme_color: "#ca2e55",
    });
  });

  it("lists icons that exist in public/, including a maskable one", () => {
    const icons = manifest().icons ?? [];
    expect(icons.some((icon) => icon.purpose === "maskable")).toBe(true);
    for (const icon of icons) {
      expect(existsSync(path.join(process.cwd(), "public", icon.src))).toBe(true);
    }
  });
});
