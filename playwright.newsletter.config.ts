import { defineConfig, devices } from "@playwright/test";

/**
 * Live newsletter signup test (e2e/newsletter-live.spec.ts). It runs against a
 * deployed site, so there's no webServer here, and it talks to the real Resend
 * API. See .github/workflows/newsletter-e2e.yml.
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/newsletter-live.spec.ts",
  forbidOnly: !!process.env.CI,
  // No retries: each attempt creates a real Resend contact
  retries: 0,
  workers: 1,
  timeout: 120_000,
  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "playwright-report", open: "never" }]]
    : [["list"]],
  use: {
    baseURL: process.env.NEWSLETTER_E2E_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  outputDir: "test-results",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
