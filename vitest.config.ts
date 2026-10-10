import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      // Count every source file, not just the ones a story happens to load
      include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
      exclude: ["**/*.stories.*", "**/*.d.ts"],
      reporter: ["text-summary", "json-summary", "html"],
    },
    projects: [
      {
        // Plain unit tests: lib/, API routes, and pages rendered to markup
        extends: true,
        resolve: { alias: { "@": dirname } },
        test: {
          name: "unit",
          environment: "node",
          include: ["**/*.test.{ts,tsx}"],
          exclude: ["node_modules/**", "e2e/**", ".next/**"],
          setupFiles: ["./test/setup.ts"],
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            // CHROMIUM_PATH lets a machine with a different Playwright browser build run these
            provider: playwright({ launchOptions: { executablePath: process.env.CHROMIUM_PATH } }),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/preview.ts"],
        },
      },
    ],
  },
});
