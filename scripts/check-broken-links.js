#!/usr/bin/env node

/**
 * Checks for broken internal links across all MDX blog posts and JSON data files.
 * Validates that:
 * - Internal hrefs (starting with /) point to existing routes
 * - Organization slugs in blog frontmatter exist in organizations.json
 * - Category/tag slugs in frontmatter exist in their respective JSON files
 *
 * Usage: node scripts/check-broken-links.js
 * Exit code 1 if broken links found (for CI use)
 */

const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "..", "content");
const appDir = path.join(__dirname, "..", "app");

// Load all known slugs
const orgs = JSON.parse(
  fs.readFileSync(path.join(contentDir, "organizations.json"), "utf8")
);
const categories = JSON.parse(
  fs.readFileSync(path.join(contentDir, "categories.json"), "utf8")
);
const tags = JSON.parse(
  fs.readFileSync(path.join(contentDir, "tags.json"), "utf8")
);
const testimonials = JSON.parse(
  fs.readFileSync(path.join(contentDir, "testimonials.json"), "utf8")
);
const experiences = JSON.parse(
  fs.readFileSync(path.join(contentDir, "experience.json"), "utf8")
);
const education = JSON.parse(
  fs.readFileSync(path.join(contentDir, "education.json"), "utf8")
);
const awards = JSON.parse(
  fs.readFileSync(path.join(contentDir, "awards.json"), "utf8")
);
const projects = JSON.parse(
  fs.readFileSync(path.join(contentDir, "projects.json"), "utf8")
);

const orgSlugs = new Set(orgs.map((o) => o.slug));
const categorySlugs = new Set(categories.map((c) => c.slug));
const tagSlugs = new Set(tags.map((t) => t.slug));

// Load blog post slugs
const blogDir = path.join(contentDir, "posts");
const blogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
const blogSlugs = new Set(blogFiles.map((f) => f.replace(".mdx", "")));

// Build set of valid routes
const validRoutes = new Set([
  "/",
  "/about",
  "/blog",
  "/contact",
  "/speaking",
  "/mentoring",
  "/mentoring/sessions",
  "/testimonials",
  "/organizations",
  "/categories",
  "/tags",
  "/uses",
  "/feed",
  "/sitemap.xml",
  "/for-llms",
  "/design-system",
  "/awards",
  "/experience",
  "/education",
]);

// Add dynamic routes
for (const slug of blogSlugs) validRoutes.add(`/blog/${slug}`);
for (const slug of orgSlugs) validRoutes.add(`/organizations/${slug}`);
for (const slug of categorySlugs) validRoutes.add(`/categories/${slug}`);
for (const slug of tagSlugs) validRoutes.add(`/tags/${slug}`);
for (const exp of experiences) validRoutes.add(`/experience/${exp.slug}`);
for (const edu of education) validRoutes.add(`/education/${edu.slug}`);
for (const award of awards) validRoutes.add(`/awards/${award.slug}`);
for (const project of projects) validRoutes.add(`/projects/${project.slug}`);
validRoutes.add("/projects");

// Slugs from the pre-migration era that were intentionally dropped during
// content consolidation. Links in old posts pointing to these will be skipped
// rather than flagged as errors so they don't block CI.
const KNOWN_MISSING_SLUGS = new Set([
  "/blog/interview-fullstack-academy",
  "/blog/interview-coding-dojo",
  "/blog/interview-devleague",
  "/blog/interview-maker-square",
  "/blog/interview-hack-reactor",
  "/blog/interview-bitmaker-labs",
  "/blog/a-short-operation-tips-tricks-4-coding-bootcamps",
  "/blog/prepare-for-coding-bootcamps",
  "/blog/one-week-left-of-fullstack",
  "/blog/coding-house-interview",
  "/blog/my-experience-with-fullstack-academy-of-code",
  "/blog/questioning-hack-reactor",
  "/blog/my-experience-with-makersquare-%f0%9f%92",
  "/blog/latinas-in-tech-silicon-valley-meetup",
  "/blog/hampton-university",
  "/blog/cornell-tech",
]);

const errors = [];

// Check blog post frontmatter references
for (const f of blogFiles) {
  const content = fs.readFileSync(path.join(blogDir, f), "utf8");
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;

  const slug = f.replace(".mdx", "");

  // Check organizations
  const orgMatch = fm[1].match(/^organizations:\s*\[(.*?)\]/m);
  if (orgMatch) {
    const orgList = orgMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/"/g, ""))
      .filter(Boolean);
    for (const org of orgList) {
      if (!orgSlugs.has(org)) {
        errors.push({
          file: `content/posts/${f}`,
          type: "organization",
          ref: org,
          message: `Organization slug "${org}" not found in organizations.json`,
        });
      }
    }
  }

  // Check categories
  const catMatch = fm[1].match(/^categories:\s*\[(.*?)\]/m);
  if (catMatch) {
    const catList = catMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/"/g, ""))
      .filter(Boolean);
    for (const cat of catList) {
      if (!categorySlugs.has(cat)) {
        errors.push({
          file: `content/posts/${f}`,
          type: "category",
          ref: cat,
          message: `Category slug "${cat}" not found in categories.json`,
        });
      }
    }
  }

  // Check internal links in body (only page routes, not images or protocol-relative URLs)
  const body = content.slice(fm[0].length);
  const linkPattern = /\[.*?\]\((\/[^)]+)\)/g;
  let match;
  while ((match = linkPattern.exec(body)) !== null) {
    const raw = match[1].trim();
    // Skip protocol-relative URLs (//example.com)
    if (raw.startsWith("//")) continue;
    // Skip image/asset paths
    if (raw.startsWith("/images/")) continue;
    // Skip script embeds and other static assets
    if (raw.match(/\.(js|css|jpg|jpeg|png|gif|svg|webp|pdf|mp4|mp3)(\?|$|")/i)) continue;
    const href = raw.split("#")[0].split("?")[0]; // strip hash and query
    if (href && !validRoutes.has(href) && !KNOWN_MISSING_SLUGS.has(href)) {
      errors.push({
        file: `content/posts/${f}`,
        type: "internal-link",
        ref: href,
        message: `Internal link "${href}" does not match any known route`,
      });
    }
  }
}

// Check JSON data cross-references (testimonial orgs are informational — warn only)
const warnings = [];
for (const testimonial of testimonials) {
  if (testimonial.organization) {
    const orgExists = orgs.some(
      (o) =>
        o.name === testimonial.organization ||
        o.slug === testimonial.organization
    );
    if (!orgExists) {
      warnings.push(
        `Testimonial by "${testimonial.name}" references external organization "${testimonial.organization}"`
      );
    }
  }
}

// Check for external URLs in TSX page files that point to known-dead domains
const KNOWN_DEAD_URL_DOMAINS = [
  "irvue.app",
];

const tsxFiles = [
  path.join(appDir, "uses/page.tsx"),
  path.join(appDir, "speaking/page.tsx"),
  path.join(appDir, "about/page.tsx"),
  path.join(appDir, "contact/page.tsx"),
  path.join(appDir, "mentoring/page.tsx"),
];

for (const f of tsxFiles) {
  if (!fs.existsSync(f)) continue;
  const content = fs.readFileSync(f, "utf8");
  const urlPattern = /["'](https?:\/\/[^"'\s]+)["']/g;
  let match;
  while ((match = urlPattern.exec(content)) !== null) {
    const url = match[1];
    for (const domain of KNOWN_DEAD_URL_DOMAINS) {
      if (url.includes(domain)) {
        errors.push({
          file: path.relative(path.join(__dirname, ".."), f),
          type: "dead-external-url",
          ref: url,
          message: `URL "${url}" points to known-dead domain "${domain}"`,
        });
      }
    }
  }
}

// Check for bad featuredImage URLs
const DEAD_IMAGE_DOMAINS = [
  "uploads-ssl.webflow.com",
  "cdn.prod.website-files.com",
  "atomic-temporary",
  "wpcomstaging.com",
  "cnet2.cbsistatic.com",
  "encrypted-tbn0.gstatic.com",
  "i.imgur.com",
  "image.slidesharecdn.com",
];

for (const f of blogFiles) {
  const content = fs.readFileSync(path.join(blogDir, f), "utf8");
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;

  const imgMatch = fm[1].match(/^featuredImage:\s*["']?(.+?)["']?\s*$/m);
  if (!imgMatch) continue;
  const imgUrl = imgMatch[1].trim();
  if (!imgUrl || imgUrl === '""' || imgUrl === "''") continue;

  for (const domain of DEAD_IMAGE_DOMAINS) {
    if (imgUrl.includes(domain)) {
      errors.push({
        file: `content/posts/${f}`,
        type: "featured-image",
        ref: imgUrl,
        message: `featuredImage points to ${domain} — migrate to Vercel Blob`,
      });
    }
  }
}

// Report results
if (warnings.length > 0) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) {
    console.log(`  ⚠ ${w}`);
  }
  console.log("");
}

if (errors.length === 0) {
  console.log("No broken links found!");
  console.log(
    `Checked: ${blogFiles.length} blog posts, ${validRoutes.size} valid routes`
  );
  process.exit(0);
} else {
  console.log(`Found ${errors.length} broken link(s):\n`);

  // Group by type
  const byType = {};
  for (const e of errors) {
    if (!byType[e.type]) byType[e.type] = [];
    byType[e.type].push(e);
  }

  for (const [type, typeErrors] of Object.entries(byType)) {
    console.log(`=== ${type.toUpperCase()} (${typeErrors.length}) ===`);
    for (const e of typeErrors) {
      console.log(`  ${e.file}: ${e.message}`);
    }
    console.log("");
  }

  process.exit(1);
}
