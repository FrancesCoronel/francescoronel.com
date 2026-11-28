import { test, expect } from "@playwright/test";

// Every page must fit a small phone without scrolling sideways. A table or
// row that is too wide should stack, wrap or scroll inside its own box.
const PAGES = [
  "/",
  "/about",
  "/posts",
  "/essays",
  "/speaking",
  "/mentoring",
  "/mentoring/sessions",
  "/work",
  "/portfolio",
  "/now",
  "/uses",
  "/testimonials",
  "/organizations",
  "/organizations/slack",
  "/tags",
  "/categories",
  "/contact",
  "/design-system",
  "/posts/accenture-alexa-hackathon",
];

// 360px is the narrowest phone we design for (small Android phones)
test.use({ viewport: { width: 360, height: 780 } });

for (const path of PAGES) {
  test(`${path} — no sideways scroll at 360px`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "The viewport is fixed above, so one project is enough");
    await page.goto(path, { waitUntil: "networkidle" });

    const overflow = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      const clipped = (el: Element) => {
        for (let a = el.parentElement; a; a = a.parentElement) {
          if (/hidden|auto|scroll|clip/.test(getComputedStyle(a).overflowX)) return true;
        }
        return false;
      };
      const offenders = Array.from(document.querySelectorAll("body *"))
        .filter((el) => {
          const box = el.getBoundingClientRect();
          return box.width > 0 && box.right > width + 1 && !clipped(el);
        })
        .slice(0, 5)
        .map((el) => `<${el.tagName.toLowerCase()} class="${el.getAttribute("class") ?? ""}"> ${(el.textContent ?? "").trim().slice(0, 40)}`);
      return { scrollWidth: document.documentElement.scrollWidth, width, offenders };
    });

    expect(overflow.offenders, `elements wider than the screen on ${path}`).toEqual([]);
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.width);
  });
}
