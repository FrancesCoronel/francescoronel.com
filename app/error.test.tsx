// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorPage from "./error";

const { reportError } = vi.hoisted(() => ({ reportError: vi.fn() }));
vi.mock("@/lib/report-error", () => ({ reportError }));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Error boundary page", () => {
  it("logs and reports the error, and retries on click", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("page failed");
    const reset = vi.fn();
    render(<ErrorPage error={error} reset={reset} />);

    expect(screen.getByText("Something went wrong")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Unexpected Error");
    expect(consoleError).toHaveBeenCalledWith(error);
    expect(reportError).toHaveBeenCalledWith(error);

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
