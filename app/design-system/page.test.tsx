import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import DesignSystemPage, { metadata } from "./page";

describe("app/design-system/page", () => {
  it("exports metadata for the design system page", () => {
    expect(metadata.title).toBe("Design System");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/design-system");
  });

  it("renders a swatch for every navy and horchata color", () => {
    const html = renderToStaticMarkup(<DesignSystemPage />);
    expect(html).toContain('style="background-color:#253137"');
    expect(html).toContain(">navy-900</p>");
    expect(html).toContain('style="background-color:#b8352d"');
    expect(html).toContain(">horchata-600</p>");
    expect(html.match(/class="h-16 w-full rounded-lg"/g)).toHaveLength(22);
  });

  it("renders a live swatch for every semantic token", () => {
    const html = renderToStaticMarkup(<DesignSystemPage />);
    for (const token of ["surface", "surface-muted", "surface-raised", "ink", "ink-muted", "line", "brand", "brand-fill", "on-brand"]) {
      expect(html).toContain(`bg-${token}"`);
    }
  });

  it("renders the typography scale", () => {
    const html = renderToStaticMarkup(<DesignSystemPage />);
    expect(html).toContain("text-5xl");
    expect(html).toContain("68px (4.25rem)");
    expect(html).toContain("Large hero text");
  });
});
