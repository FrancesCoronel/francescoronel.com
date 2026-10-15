// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BackToTop } from "./back-to-top";

afterEach(cleanup);

function scrollTo(y: number, { innerHeight = 800, scrollHeight = 5000 } = {}) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: innerHeight, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("BackToTop", () => {
  it("is hidden until the page is scrolled past 400px", () => {
    render(<BackToTop />);
    expect(screen.queryByRole("button")).toBeNull();
    scrollTo(300);
    expect(screen.queryByRole("button")).toBeNull();
    scrollTo(1000);
    expect(screen.getByRole("button", { name: "Back to top" })).toBeInTheDocument();
  });

  it("hides again near the bottom of the page", () => {
    render(<BackToTop />);
    scrollTo(1000);
    expect(screen.getByRole("button")).toBeInTheDocument();
    scrollTo(4000);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("smooth-scrolls to the top when clicked", () => {
    const spy = vi.fn();
    vi.stubGlobal("scrollTo", spy);
    render(<BackToTop />);
    scrollTo(1000);
    fireEvent.click(screen.getByRole("button"));
    expect(spy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("removes its scroll listener on unmount", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<BackToTop />);
    unmount();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    remove.mockRestore();
  });
});
