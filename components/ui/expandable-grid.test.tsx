// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ExpandableGrid } from "./expandable-grid";

afterEach(cleanup);

const items = (n: number) => Array.from({ length: n }, (_, i) => <span key={i}>Item {i + 1}</span>);

describe("ExpandableGrid", () => {
  it("shows the first six items and expands to show the rest", () => {
    render(<ExpandableGrid>{items(9)}</ExpandableGrid>);
    expect(screen.getAllByText(/^Item/)).toHaveLength(6);
    fireEvent.click(screen.getByRole("button", { name: "Show 3 more ↓" }));
    expect(screen.getAllByText(/^Item/)).toHaveLength(9);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("hides the button when everything already fits", () => {
    const { container } = render(
      <ExpandableGrid initialCount={4} className="grid">
        {items(4)}
      </ExpandableGrid>
    );
    expect(screen.getAllByText(/^Item/)).toHaveLength(4);
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.firstChild).toHaveClass("grid");
  });

  it("respects a custom initial count", () => {
    render(<ExpandableGrid initialCount={2}>{items(5)}</ExpandableGrid>);
    expect(screen.getAllByText(/^Item/)).toHaveLength(2);
    expect(screen.getByRole("button")).toHaveTextContent("Show 3 more ↓");
  });
});
