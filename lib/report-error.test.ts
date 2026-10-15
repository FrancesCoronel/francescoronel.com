import { describe, expect, it, vi } from "vitest";

const { captureException, sentryConfigLoaded } = vi.hoisted(() => ({
  captureException: vi.fn(),
  sentryConfigLoaded: vi.fn(),
}));

vi.mock("@/sentry.client.config", () => {
  sentryConfigLoaded();
  return {};
});
vi.mock("@sentry/nextjs", () => ({ captureException }));

import { reportError } from "./report-error";

describe("reportError", () => {
  it("loads the Sentry client config and reports the error", async () => {
    const error = new Error("boom");
    await reportError(error);
    expect(sentryConfigLoaded).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledWith(error);
  });
});
