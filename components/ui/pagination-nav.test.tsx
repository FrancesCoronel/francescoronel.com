// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PaginationNav } from "./pagination-nav";

function labels() {
  return Array.from(screen.getByRole("navigation").children).map((el) => el.textContent);
}

afterEach(cleanup);

describe("PaginationNav", () => {
  it.each([0, 1])("renders nothing for %i total pages", (totalPages) => {
    const { container } = render(<PaginationNav page={1} totalPages={totalPages} onPage={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows every page when there are few", () => {
    render(<PaginationNav page={1} totalPages={3} onPage={vi.fn()} />);
    expect(labels()).toEqual(["Previous", "1", "2", "3", "Next"]);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "1" })).toHaveClass("bg-horchata-500");
    expect(screen.getByRole("button", { name: "2" })).not.toHaveClass("bg-horchata-500");
  });

  it("collapses distant pages into ellipses around the current page", () => {
    render(<PaginationNav page={5} totalPages={10} onPage={vi.fn()} />);
    expect(labels()).toEqual(["Previous", "1", "...", "3", "4", "5", "6", "7", "...", "10", "Next"]);
  });

  it("disables Next on the last page", () => {
    render(<PaginationNav page={10} totalPages={10} onPage={vi.fn()} />);
    expect(labels()).toEqual(["Previous", "1", "...", "8", "9", "10", "Next"]);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  });

  it("reports the requested page", async () => {
    const user = userEvent.setup();
    const onPage = vi.fn();
    render(<PaginationNav page={5} totalPages={10} onPage={onPage} />);
    await user.click(screen.getByRole("button", { name: "Previous" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "10" }));
    expect(onPage.mock.calls).toEqual([[4], [6], [10]]);
  });
});
