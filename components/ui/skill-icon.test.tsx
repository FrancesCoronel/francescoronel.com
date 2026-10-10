// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { getSkillEmoji, getSkillUrl, hasSkillIcon, SkillIcon } from "./skill-icon";

afterEach(cleanup);

describe("skill icon helpers", () => {
  it("knows which skills have icons", () => {
    expect(hasSkillIcon("react")).toBe(true);
    expect(hasSkillIcon("mentoring")).toBe(false);
  });

  it("resolves skill URLs from icons, fallbacks, or null", () => {
    expect(getSkillUrl("typescript")).toBe("https://www.typescriptlang.org");
    expect(getSkillUrl("public-speaking")).toBe("/speaking");
    expect(getSkillUrl("unknown-skill")).toBeNull();
  });

  it("resolves emoji fallbacks", () => {
    expect(getSkillEmoji("mentoring")).toBe("🤝🏽");
    expect(getSkillEmoji("react")).toBeNull();
  });
});

describe("SkillIcon", () => {
  it("renders nothing for unknown skills", () => {
    const { container } = render(<SkillIcon slug="mentoring" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a brand-coloured svg at the default size", () => {
    const { container } = render(<SkillIcon slug="react" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("fill", "#61DAFB");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg.querySelector("path")?.getAttribute("d")).toMatch(/^M14\.23/);
  });

  it("renders at a custom size", () => {
    const { container } = render(<SkillIcon slug="python" size={32} />);
    expect(container.querySelector("svg")).toHaveAttribute("height", "32");
  });
});
