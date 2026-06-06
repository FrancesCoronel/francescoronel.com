import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "playwright-report", open: "never" }]]
    : [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  outputDir: "test-results",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      // Exclude visual tests from default run; run them explicitly
      testIgnore: process.env.VISUAL ? [] : ["**/visual.spec.ts"],
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
      testIgnore: process.env.VISUAL ? [] : ["**/visual.spec.ts"],
    },
    // Dedicated project for visual screenshots — desktop 1280×800
    {
      name: "visual-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
      testMatch: "**/visual.spec.ts",
    },
    // Dedicated project for visual screenshots — mobile 390×844
    {
      name: "visual-mobile",
      use: { ...devices["iPhone 14"], viewport: { width: 390, height: 844 } },
      testMatch: "**/visual.spec.ts",
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
