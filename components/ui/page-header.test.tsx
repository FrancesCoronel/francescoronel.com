// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PageHeader } from "./page-header";

afterEach(cleanup);

describe("PageHeader", () => {
  it("renders the label and heading without optional parts", () => {
    const { container } = render(<PageHeader label="Blog" heading="Posts ✍🏽" />);
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Posts ✍🏽");
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(container.querySelector(".order-1")).toBeNull();
  });

  it("renders the description, children and aside in a two-column layout", () => {
    const { container } = render(
      <PageHeader label="About" heading="Hi" description="Some words" aside={<span>Portrait</span>}>
        <a href="/contact">Contact</a>
      </PageHeader>
    );
    expect(screen.getByText("Some words")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
    const aside = container.querySelector(".order-1")!;
    expect(aside).toContainElement(screen.getByText("Portrait"));
    expect(container.querySelector(".order-2")).toContainElement(screen.getByRole("heading"));
  });
});
