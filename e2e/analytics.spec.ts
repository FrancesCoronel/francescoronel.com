import { test, expect, type Page } from "@playwright/test";

/**
 * Custom analytics events reach Vercel Analytics in a real browser. Off Vercel
 * (local builds, CI) its script isn't loaded, so events wait in the queue
 * trackEvent sets up, window.vaq, which is what the script reads once it loads.
 * The tests read that queue.
 */

type Queued = [string, { name: string; data?: Record<string, unknown> }];

async function events(page: Page, name: string) {
  const queued = await page.evaluate(() => (window as unknown as { vaq?: Queued[] }).vaq ?? []);
  return queued.filter(([kind, e]) => kind === "event" && e.name === name).map(([, e]) => e.data ?? {});
}

test("404 pages log the missing path", async ({ page }) => {
  await page.goto("/posts/this-post-does-not-exist");
  await expect.poll(() => events(page, "page_not_found")).toEqual([
    { path: "/posts/this-post-does-not-exist" },
  ]);
});

test("searching and picking a result logs one search", async ({ page }) => {
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Toggle menu" });
  const dialog = page.getByRole("dialog", { name: "Search" });
  await expect(async () => {
    if ((await menu.isVisible()) && (await menu.getAttribute("aria-expanded")) !== "true") {
      await menu.click();
    }
    await page.getByRole("button", { name: /^Search/ }).locator("visible=true").click();
    await expect(dialog).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await dialog.getByRole("searchbox").fill("mentoring");
  const first = dialog.getByRole("link").first();
  await expect(first).toBeVisible({ timeout: 15_000 });
  const href = await first.getAttribute("href");
  await first.click();
  await expect(page).toHaveURL(href!);

  const searches = await events(page, "search");
  expect(searches).toHaveLength(1);
  expect(searches[0]).toMatchObject({ search_term: "mentoring", selected_url: href, selected_position: 1 });
  expect(searches[0].results).toBeGreaterThan(0);
});

test("outbound links are logged", async ({ page }) => {
  await page.goto("/contact");
  // Keep the browser on the page; only the click matters here
  await page.evaluate(() =>
    document.addEventListener("click", (e) => {
      if ((e.target as Element).closest("a[href^='http']")) e.preventDefault();
    }),
  );
  const outbound = page.locator("main a[href^='https://']:visible").first();
  await outbound.click();
  const domain = new URL((await outbound.getAttribute("href"))!).hostname;
  await expect.poll(() => events(page, "outbound_click")).toContainEqual(
    expect.objectContaining({ domain, page: "/contact" }),
  );
});

test("reading a post to the end logs it once", async ({ page }) => {
  await page.goto("/posts");
  await page.locator("a[href^='/posts/']").first().click();
  await page.waitForURL(/\/posts\/.+/);
  const path = new URL(page.url()).pathname;
  // Lazy images can grow the page after the first jump, so keep going to the bottom
  await expect
    .poll(async () => {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      return events(page, "post_read");
    })
    .toEqual([{ page: path }]);
});
