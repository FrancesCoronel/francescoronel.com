/**
 * Visual regression tests — capture screenshots of key pages and components.
 *
 * Run locally:  npm run test:e2e -- e2e/visual.spec.ts
 * Update snapshots: npm run test:e2e -- --update-snapshots e2e/visual.spec.ts
 *
 * Screenshots land in test-results/ and are uploaded as CI artifacts so PR
 * reviewers can diff visuals without a local checkout.
 */

import { test, expect, type Page } from "@playwright/test";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function screenshot(
  page: Page,
  name: string,
  clip?: { x: number; y: number; width: number; height: number }
) {
  return page.screenshot({
    path: `test-results/screenshots/${name}.png`,
    fullPage: !clip,
    ...(clip ? { clip } : {}),
  });
}

// ─── Full-page shots ─────────────────────────────────────────────────────────

const PAGES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "posts", path: "/posts" },
  { name: "speaking", path: "/speaking" },
  { name: "contact", path: "/contact" },
  { name: "portfolio", path: "/portfolio" },
  { name: "testimonials", path: "/testimonials" },
  { name: "organizations", path: "/organizations" },
  { name: "experience", path: "/experience" },
  { name: "education", path: "/education" },
  { name: "tags", path: "/tags" },
  { name: "design-system", path: "/design-system" },
];

for (const { name, path } of PAGES) {
  test(`screenshot — ${name} (desktop)`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    // Dismiss cookie banners / skeleton loaders
    await page.waitForTimeout(500);
    await screenshot(page, `${name}-desktop`);
  });

  test(`screenshot — ${name} (mobile)`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    await screenshot(page, `${name}-mobile`);
  });
}

// ─── Dark mode ───────────────────────────────────────────────────────────────

test("screenshot — home dark mode", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Toggle dark mode via the theme button
  const themeBtn = page.getByRole("button", { name: /toggle.*theme|dark.*mode|light.*mode/i }).first();
  if (await themeBtn.isVisible()) {
    await themeBtn.click();
    await page.waitForTimeout(300);
  } else {
    // Force dark via class if toggle not found
    await page.evaluate(() => document.documentElement.classList.add("dark"));
  }
  await screenshot(page, "home-dark");
});

// ─── Component-level shots ────────────────────────────────────────────────────

test("screenshot — navigation bar", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const nav = page.getByRole("navigation").first();
  const box = await nav.boundingBox();
  if (box) {
    await screenshot(page, "component-navbar", {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    });
  }
});

test("screenshot — footer", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  const box = await footer.boundingBox();
  if (box) {
    await screenshot(page, "component-footer", {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    });
  }
});

test("screenshot — blog card grid", async ({ page }) => {
  await page.goto("/posts");
  await page.waitForLoadState("networkidle");
  const grid = page.locator("ul, ol, [class*='grid']").filter({ has: page.locator("a[href^='/posts/']") }).first();
  await grid.scrollIntoViewIfNeeded();
  const box = await grid.boundingBox();
  if (box && box.width > 0 && box.height > 0) {
    const x = Math.max(0, Math.round(box.x));
    const y = Math.max(0, Math.round(box.y));
    const vp = page.viewportSize()!;
    const width = Math.min(Math.round(box.width), vp.width - x);
    const height = Math.min(Math.round(box.height), 800, vp.height - y);
    if (width > 0 && height > 0) {
      await screenshot(page, "component-blog-card-grid", { x, y, width, height });
      return;
    }
  }
  // Fallback: full-page screenshot if grid clip isn't usable
  await screenshot(page, "component-blog-card-grid");
});

test("screenshot — mobile hamburger open", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const hamburger = page.getByRole("button", { name: /menu|open nav/i }).first();
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await page.waitForTimeout(300);
  }
  await screenshot(page, "component-mobile-nav-open");
});

test("screenshot — post detail hero", async ({ page }) => {
  await page.goto("/posts");
  const firstPost = page.locator("a[href^='/posts/']").first();
  const href = await firstPost.getAttribute("href");
  await page.goto(href!);
  await page.waitForLoadState("networkidle");
  // Capture just the top ~600px (title + hero)
  await screenshot(page, "component-post-hero", {
    x: 0,
    y: 0,
    width: 1280,
    height: 600,
  });
});
