import { test, expect, type Page } from "@playwright/test";

/**
 * Search results must link to real pages, on desktop and mobile.
 *
 * Production broke because the Vercel build adapter names prerendered pages
 * `*.prerender-fallback.html`, so every Pagefind result linked to a 404.
 * CI builds the index from .next/server/app, where pages are plain `*.html`,
 * so the second test stands in a Pagefind module that returns the Vercel
 * layout's URLs.
 */

const BAD_HREF = /\.html$|prerender-fallback|\/index$/;

async function openSearch(page: Page) {
  const menu = page.getByRole("button", { name: "Toggle menu" });
  const dialog = page.getByRole("dialog", { name: "Search" });
  // Retry until React has hydrated and the click opens the overlay
  await expect(async () => {
    if ((await menu.isVisible()) && (await menu.getAttribute("aria-expanded")) !== "true") {
      await menu.click();
    }
    await page.getByRole("button", { name: /^Search/ }).locator("visible=true").click();
    await expect(dialog).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
  return dialog;
}

async function expectResultsLoad(page: Page, query: string) {
  const dialog = await openSearch(page);
  await dialog.getByRole("searchbox").fill(query);

  const results = dialog.getByRole("link");
  await expect(results.first()).toBeVisible({ timeout: 15_000 });

  const hrefs = await results.evaluateAll((links) =>
    links.map((a) => a.getAttribute("href") ?? ""),
  );
  for (const href of hrefs) {
    expect(href, `search result href ${href}`).toMatch(/^\//);
    expect(href, `search result href ${href}`).not.toMatch(BAD_HREF);
  }

  // Every result must be a page that exists
  for (const href of hrefs) {
    const res = await page.request.get(href);
    expect(res.status(), `GET ${href}`).toBe(200);
  }

  // And tapping one actually lands on it
  await results.first().click();
  await expect(page).toHaveURL(hrefs[0]);
  await expect(page).not.toHaveTitle(/404|not found/i);
}

test("search — results from the built index open real pages", async ({ page }) => {
  await page.goto("/");
  await expectResultsLoad(page, "mentoring");
});

test("search — Vercel prerender-fallback URLs still open real pages", async ({ page }) => {
  await page.route("**/pagefind/pagefind.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `
        const urls = [
          "/posts/canvas-mentorship-accelerator.prerender-fallback.html",
          "/tags/mentoring.prerender-fallback.html",
          "/about/index.prerender-fallback.html",
        ];
        export async function init() {}
        export async function search() {
          return {
            results: urls.map((url) => ({
              id: url,
              data: async () => ({ url, excerpt: "a <mark>match</mark>", meta: { title: url } }),
            })),
          };
        }
      `,
    }),
  );
  await page.goto("/");
  await expectResultsLoad(page, "mentoring");
});
