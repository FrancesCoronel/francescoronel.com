// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { SectionHeader } from "./section-header";

afterEach(cleanup);

describe("SectionHeader", () => {
  it("renders the label and a large h2 by default", () => {
    const { container } = render(<SectionHeader label="Events" title="Speaking 🎤" />);
    expect(screen.getByText("Events")).toHaveClass("uppercase", "dark:text-accent-light");
    const heading = screen.getByRole("heading", { level: 2, name: "Speaking 🎤" });
    expect(heading).toHaveClass("text-xl", "sm:text-3xl");
    expect(container.firstElementChild).not.toHaveAttribute("class");
  });

  it("takes a heading level, size, id and classes", () => {
    const { container } = render(
      <SectionHeader as="h3" size="sm" id="talks" label="Talks" title="Recent" className="mb-6" titleClassName="text-center" />,
    );
    const heading = screen.getByRole("heading", { level: 3, name: "Recent" });
    expect(heading).toHaveAttribute("id", "talks");
    expect(heading).toHaveClass("text-lg", "sm:text-2xl", "text-center");
    expect(container.firstElementChild).toHaveClass("mb-6");
    render(<SectionHeader size="md" label="Upcoming" title="Next Up" />);
    expect(screen.getByRole("heading", { name: "Next Up" })).toHaveClass("text-2xl");
  });
});
