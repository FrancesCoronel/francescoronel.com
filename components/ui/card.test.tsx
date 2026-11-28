// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Card, cardClasses } from "./card";

afterEach(cleanup);

describe("Card", () => {
  it("renders a div with the card surface", () => {
    render(<Card className="p-6">Body</Card>);
    const card = screen.getByText("Body");
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveClass("rounded-2xl", "border-line", "bg-surface-raised", "p-6");
    expect(card).not.toHaveClass("hover:shadow-md");
  });

  it("renders as another element with the hover lift", () => {
    render(
      <Card as="a" href="/work" interactive>
        Work
      </Card>,
    );
    const link = screen.getByRole("link", { name: "Work" });
    expect(link).toHaveAttribute("href", "/work");
    expect(link).toHaveClass("hover:shadow-md");
    expect(cardClasses).toBe("rounded-2xl border border-line bg-surface-raised");
  });
});
