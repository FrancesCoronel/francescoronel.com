// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { ReadingProgress } from "./reading-progress";

afterEach(cleanup);

function setPage(scrollY: number, scrollHeight: number, innerHeight = 1000) {
  Object.defineProperty(window, "scrollY", { value: scrollY, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: innerHeight, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
}

describe("ReadingProgress", () => {
  it("starts at 0% when the page does not scroll", () => {
    setPage(0, 500);
    const { container } = render(<ReadingProgress />);
    const bar = container.firstChild as HTMLElement;
    expect(bar).toHaveAttribute("aria-hidden", "true");
    expect(bar.style.width).toBe("0%");
  });

  it("tracks scroll position as a percentage of the scrollable height", () => {
    setPage(0, 3000);
    const { container } = render(<ReadingProgress />);
    const bar = container.firstChild as HTMLElement;
    setPage(1000, 3000);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(bar.style.width).toBe("50%");
  });

  it("removes its scroll listener on unmount", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ReadingProgress />);
    unmount();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    remove.mockRestore();
  });
});
