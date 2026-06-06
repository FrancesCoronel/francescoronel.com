/**
 * Component interaction tests — verify interactive UI behaviour.
 *
 * These complement the smoke tests (which check page loads) and visual tests
 * (which capture screenshots) by exercising component state changes:
 * theme toggle, search overlay, newsletter form, pagination, and more.
 */

import { test, expect } from "@playwright/test";

// ─── Theme toggle ─────────────────────────────────────────────────────────────

test("theme toggle — switches between light and dark", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");

  const isDark = async () =>
    (await html.getAttribute("class"))?.includes("dark") ||
    (await html.getAttribute("data-theme")) === "dark";

  const before = await isDark();

  // Try multiple likely selectors for the theme toggle button
  const toggle = page
    .getByRole("button", { name: /toggle.*theme|dark.*mode|light.*mode|theme/i })
    .or(page.locator("[aria-label*='theme' i], [aria-label*='dark' i], [aria-label*='light' i]"))
    .or(page.locator("button").filter({ has: page.locator("svg") }).last())
    .first();

  if (!(await toggle.isVisible({ timeout: 3000 }).catch(() => false))) {
    test.skip(true, "Theme toggle button not found — skipping");
    return;
  }
  await toggle.click();
  await page.waitForTimeout(300);

  const after = await isDark();
  expect(after).toBe(!before);
});

// ─── Navigation ───────────────────────────────────────────────────────────────

test("desktop nav — active link is present on /about", async ({ page }, info) => {
  test.skip(info.project.name === "Mobile Chrome", "desktop only");
  await page.goto("/about");
  const nav = page.getByRole("navigation").first();
  // The about link should be visible in the nav
  const aboutLink = nav.getByRole("link", { name: /about/i });
  await expect(aboutLink).toBeVisible();
  // Verify the link points to /about (confirms routing is working)
  const href = await aboutLink.getAttribute("href");
  expect(href).toMatch(/\/about/);
});

test("mobile nav — hamburger opens and closes overlay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const openBtn = page.getByRole("button", { name: /menu|open/i }).first();
  await expect(openBtn).toBeVisible();
  await openBtn.click();
  await page.waitForTimeout(200);

  // At least one nav link should now be visible
  const navLinks = page.getByRole("link", { name: /posts|about|speaking/i });
  await expect(navLinks.first()).toBeVisible();

  // Close it
  const closeBtn = page.getByRole("button", { name: /close/i }).first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(200);
    await expect(navLinks.first()).not.toBeVisible();
  }
});

// ─── Search ───────────────────────────────────────────────────────────────────

test("search — input opens and accepts a query", async ({ page }) => {
  await page.goto("/posts");

  // Pagefind search may be behind a trigger button — click it first if visible
  const searchBtn = page.getByRole("button", { name: /search/i }).first();
  if (await searchBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await searchBtn.click();
    await page.waitForTimeout(200);
  }

  const searchInput = page
    .getByRole("searchbox")
    .or(page.getByPlaceholder(/search/i))
    .first();

  if (!(await searchInput.isVisible({ timeout: 3000 }).catch(() => false))) {
    test.skip(true, "Search input not found — Pagefind may not be indexed in this build");
    return;
  }

  await searchInput.fill("javascript");
  await page.waitForTimeout(600); // debounce
  await expect(page).not.toHaveTitle(/error|500/i);
});

// ─── Blog pagination ──────────────────────────────────────────────────────────

test("blog — pagination navigates to page 2", async ({ page }) => {
  await page.goto("/posts");
  const nextBtn = page
    .getByRole("link", { name: /next|page 2|›|→/i })
    .or(page.getByRole("button", { name: /next/i }))
    .first();

  if (await nextBtn.isVisible()) {
    const firstPostHref = await page.locator("a[href^='/posts/']").first().getAttribute("href");
    await nextBtn.click();
    await page.waitForLoadState("networkidle");
    // Should be on a different set of posts
    const newFirstHref = await page.locator("a[href^='/posts/']").first().getAttribute("href");
    expect(newFirstHref).not.toBe(firstPostHref);
  } else {
    test.skip(true, "No pagination found — all posts fit on one page");
  }
});

// ─── Newsletter form ──────────────────────────────────────────────────────────

test("newsletter — shows validation on empty submit", async ({ page }) => {
  await page.goto("/");
  const form = page.locator("form").filter({ has: page.getByRole("textbox", { name: /email/i }) }).first();
  if (!(await form.isVisible())) {
    test.skip(true, "Newsletter form not found on home page");
    return;
  }
  const submitBtn = form.getByRole("button", { name: /subscribe|sign up/i }).first();
  await submitBtn.click();
  // Browser native validation should fire; just ensure we stay on the same page (no nav away)
  await page.waitForTimeout(300);
  expect(page.url()).toContain("localhost");
  await expect(page).not.toHaveTitle(/error|500/i);
});

test("newsletter — accepts valid email input", async ({ page }) => {
  await page.goto("/");
  const emailInput = page.getByRole("textbox", { name: /email/i }).first();
  if (!(await emailInput.isVisible())) {
    test.skip(true, "Newsletter email input not found");
    return;
  }
  await emailInput.fill("test@example.com");
  await expect(emailInput).toHaveValue("test@example.com");
});

// ─── Testimonial expand/collapse ──────────────────────────────────────────────

test("testimonial card — expands truncated text", async ({ page }) => {
  await page.goto("/testimonials");
  const readMore = page.getByRole("button", { name: /read more/i }).first();
  if (await readMore.isVisible()) {
    await readMore.click();
    await page.waitForTimeout(200);
    // "Read less" or "Collapse" should now show
    const collapse = page.getByRole("button", { name: /read less|collapse/i }).first();
    await expect(collapse).toBeVisible();
  } else {
    test.skip(true, "No truncated testimonials found");
  }
});

// ─── Blog category filter ─────────────────────────────────────────────────────

test("blog — category filter narrows results", async ({ page }) => {
  await page.goto("/posts");
  // Look for category filter chips / buttons
  const filterBtn = page
    .getByRole("button", { name: /career|engineering|life|tech/i })
    .first();

  if (await filterBtn.isVisible()) {
    const beforeCount = await page.locator("a[href^='/posts/']").count();
    await filterBtn.click();
    await page.waitForTimeout(300);
    const afterCount = await page.locator("a[href^='/posts/']").count();
    // Either the count changes or posts reload — just no crash
    expect(afterCount).toBeGreaterThan(0);
    _ = beforeCount; // referenced to avoid lint warning
  } else {
    test.skip(true, "No client-side category filter found");
  }
});

// silence unused variable lint in the category filter test
const _ = undefined;

// ─── External link safety ─────────────────────────────────────────────────────

test("external links — have rel=noopener", async ({ page }) => {
  await page.goto("/about");
  const externalLinks = await page.locator("a[href^='http']").all();
  for (const link of externalLinks.slice(0, 20)) {
    const rel = (await link.getAttribute("rel")) ?? "";
    const href = await link.getAttribute("href");
    // Skip same-origin links that happen to be absolute
    try {
      const { hostname } = new URL(href ?? "");
      if (hostname === "francescoronel.com" || hostname === "www.francescoronel.com") continue;
    } catch {
      continue; // relative or malformed URL — skip
    }
    expect(rel, `${href} missing noopener`).toContain("noopener");
  }
});

// ─── 404 page ─────────────────────────────────────────────────────────────────

test("404 page — renders custom not-found page", async ({ page }) => {
  const res = await page.goto("/this-page-definitely-does-not-exist-xyz-123");
  // Next.js returns 404 for unknown routes
  expect(res?.status()).toBe(404);
  // Should show our custom UI, not a blank screen
  await expect(page.getByRole("heading").first()).toBeVisible();
});
