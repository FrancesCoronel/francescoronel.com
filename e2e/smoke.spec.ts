import { test, expect } from "@playwright/test";

const STATIC_PAGES = [
  { path: "/", heading: /hi.*frances/i },
  { path: "/about", heading: /about/i },
  { path: "/posts", heading: /posts/i },
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
  await expect(nav.getByRole("link", { name: /posts/i })).toBeVisible();
  await expect(nav.getByRole("link", { name: /about/i })).toBeVisible();
});

test("posts — shows post list items", async ({ page }) => {
  await page.goto("/posts");
  await expect(page.getByRole("heading", { name: /posts/i }).first()).toBeVisible();
  // At least one link to a post should exist on the page
  await expect(page.locator("a[href^='/posts/']").first()).toBeVisible();
});

test("post — renders content", async ({ page }) => {
  await page.goto("/posts");
  const firstPostLink = page.locator("a[href^='/posts/']").first();
  const href = await firstPostLink.getAttribute("href");
  await page.goto(href!);
  await expect(page).not.toHaveTitle(/404/i);
  await expect(page.getByRole("heading").first()).toBeVisible();
});

test("organizations — detail page loads", async ({ page }) => {
  await page.goto("/organizations/latina-dev");
  await expect(page.getByRole("heading", { name: /latina/i }).first()).toBeVisible();
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
  expect(body.toLowerCase()).toContain("user-agent");
});

test("mobile — nav is usable on small screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByRole("navigation").first()).toBeVisible();
});
