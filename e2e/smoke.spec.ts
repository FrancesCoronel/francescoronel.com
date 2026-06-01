import { test, expect } from "@playwright/test";

const STATIC_PAGES = [
  { path: "/", heading: /frances coronel/i },
  { path: "/about", heading: /about/i },
  { path: "/blog", heading: /blog/i },
  { path: "/speaking", heading: /speaking/i },
  { path: "/contact", heading: /contact/i },
  { path: "/portfolio", heading: /portfolio|projects/i },
  { path: "/testimonials", heading: /testimonials/i },
  { path: "/organizations", heading: /organizations/i },
  { path: "/experience", heading: /experience/i },
  { path: "/education", heading: /education/i },
];

for (const { path, heading } of STATIC_PAGES) {
  test(`${path} — loads and shows heading`, async ({ page }) => {
    await page.goto(path);
    await expect(page).not.toHaveTitle(/404|not found/i);
    await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
  });
}

test("home — nav links are present", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation").first();
  await expect(nav.getByRole("link", { name: /blog/i })).toBeVisible();
  await expect(nav.getByRole("link", { name: /about/i })).toBeVisible();
});

test("blog — shows post cards", async ({ page }) => {
  await page.goto("/blog");
  const cards = page.getByRole("article");
  await expect(cards.first()).toBeVisible();
});

test("blog post — renders content", async ({ page }) => {
  await page.goto("/blog");
  const firstLink = page.getByRole("article").first().getByRole("link").first();
  const href = await firstLink.getAttribute("href");
  await page.goto(href!);
  await expect(page).not.toHaveTitle(/404/i);
  await expect(page.getByRole("article")).toBeVisible();
});

test("organizations — detail page loads", async ({ page }) => {
  await page.goto("/organizations/slack");
  await expect(page.getByRole("heading", { name: /slack/i })).toBeVisible();
});

test("experience detail page loads", async ({ page }) => {
  await page.goto("/experience");
  const firstLink = page.getByRole("link", { name: /view/i }).or(
    page.locator("a[href^='/experience/']")
  ).first();
  const href = await firstLink.getAttribute("href");
  if (href) {
    await page.goto(href);
    await expect(page).not.toHaveTitle(/404/i);
  }
});

test("RSS feed returns XML", async ({ request }) => {
  const res = await request.get("/feed");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toMatch(/xml/);
});

test("sitemap returns XML", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toMatch(/xml/);
});

test("robots.txt allows crawlers", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain("User-agent");
});

test("dark mode toggle works", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /theme|dark|light/i });
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("class", /dark/);
  }
});

test("mobile — nav is usable on small screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByRole("navigation").first()).toBeVisible();
});
