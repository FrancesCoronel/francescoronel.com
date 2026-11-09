import { test, expect, type Page } from "@playwright/test";

/**
 * Custom analytics events reach gtag in a real browser. CI builds without a
 * GA4 id, so gtag isn't loaded and a stand-in records what would be sent.
 * Vercel Analytics gets the same calls through @vercel/analytics, covered by
 * unit tests.
 */

type Sent = [string, string, Record<string, unknown>];

async function recordEvents(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __events: unknown[]; gtag: (...args: unknown[]) => void };
    w.__events = [];
    w.gtag = (...args: unknown[]) => w.__events.push(args);
  });
}

async function events(page: Page, name: string) {
  const all = await page.evaluate(() => (window as unknown as { __events: Sent[] }).__events);
  return all.filter(([command, event]) => command === "event" && event === name).map(([, , props]) => props);
}

test.beforeEach(async ({ page }) => {
  await recordEvents(page);
});

test("404 pages log the missing path", async ({ page }) => {
  await page.goto("/posts/this-post-does-not-exist");
  await expect.poll(() => events(page, "page_not_found")).toEqual([
    { path: "/posts/this-post-does-not-exist" },
  ]);
  // It fires on load, before Vercel's script exists, so it must wait in the queue
  const queued = await page.evaluate(() => (window as unknown as { vaq?: [string, { name: string }][] }).vaq ?? []);
  expect(queued.map(([kind, e]) => `${kind}:${e.name}`)).toContain("event:page_not_found");
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

test("scrolling a post logs scroll depth", async ({ page }) => {
  await page.goto("/posts");
  await page.locator("a[href^='/posts/']").first().click();
  await page.waitForURL(/\/posts\/.+/);
  // Lazy images can grow the page after the first jump, so keep going to the bottom
  await expect
    .poll(async () => {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      return (await events(page, "scroll_depth")).map((e) => e.percent);
    })
    .toEqual([25, 50, 75, 100]);
});
