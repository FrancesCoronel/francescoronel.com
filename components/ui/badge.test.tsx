// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Badge, CATEGORY_TONES } from "./badge";

afterEach(cleanup);

describe("Badge", () => {
  it("defaults to a small neutral pill", () => {
    render(<Badge>Side Project</Badge>);
    const badge = screen.getByText("Side Project");
    expect(badge).toHaveClass("rounded-full", "text-2xs", "font-semibold", "bg-horchata-100");
  });

  it("uses the status tone, size, weight and extra classes", () => {
    render(
      <Badge tone="success" size="md" weight="medium" className="shrink-0">
        Active
      </Badge>,
    );
    expect(screen.getByText("Active")).toHaveClass("bg-success-soft", "text-success", "text-xs", "font-medium", "shrink-0");
  });

  it("falls back to neutral for an unknown category", () => {
    render(<Badge tone={CATEGORY_TONES["work-project"]}>Work</Badge>);
    expect(screen.getByText("Work")).toHaveClass("bg-horchata-100");
    expect(CATEGORY_TONES["open-source"]).toBe("success");
  });
});
