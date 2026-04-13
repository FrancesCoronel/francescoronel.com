#!/usr/bin/env node
/**
 * Cross-post a blog post to dev.to.
 *
 * Usage:
 *   node scripts/crosspost-devto.js content/blog/my-post.mdx
 *
 * Required env vars:
 *   DEVTO_API_KEY — your dev.to API key (Settings → Account → DEV API Keys)
 *
 * The script:
 *   1. Reads frontmatter (title, excerpt, tags, featuredImage, date)
 *   2. Strips MDX-specific syntax (imports, JSX components) for plain Markdown
 *   3. Posts to dev.to with a canonical URL pointing back to francescoronel.com
 *   4. Prints the published URL on success
 *
 * To update an existing article, set `devto_id` in the post frontmatter and
 * re-run — the script will PUT instead of POST.
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = "https://www.francescoronel.com";
const DEVTO_API = "https://dev.to/api/articles";

// Map site categories/tags to dev.to-compatible tags (max 4, lowercase, no spaces, max 30 chars)
const TAG_MAP = {
  "software-engineering": "webdev",
  "open-source": "opensource",
  "career-advice": "career",
  "diversity-inclusion": "diversity",
  javascript: "javascript",
  typescript: "typescript",
  react: "react",
  nextjs: "nextjs",
  python: "python",
  "machine-learning": "machinelearning",
  "artificial-intelligence": "ai",
  productivity: "productivity",
  "side-project": "sideproject",
  "work-project": "webdev",
  hackathon: "hackathon",
  podcast: "podcast",
};

function mdxToMarkdown(content) {
  return content
    // Remove import statements
    .replace(/^import\s+.*from\s+['"][^'"]+['"]\s*;?\s*$/gm, "")
    // Remove export statements
    .replace(/^export\s+.*$/gm, "")
    // Replace common MDX components with Markdown equivalents
    .replace(/<Callout[^>]*>([\s\S]*?)<\/Callout>/g, "> $1")
    .replace(/<Tweet\s+id="([^"]+)"\s*\/>/g, "https://twitter.com/i/status/$1")
    .replace(
      /<YouTubeEmbed\s+url="([^"]+)"\s*\/>/g,
      (_, url) => url
    )
    // Remove remaining JSX/HTML tags that dev.to won't render
    .replace(/<[A-Z][A-Za-z]*[^>]*\/>/g, "")
    .replace(/<[A-Z][A-Za-z]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z]*>/g, "")
    // Clean up multiple blank lines left by removals
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildDevToTags(categories = [], tags = []) {
  const all = [...categories, ...tags];
  const mapped = all
    .map((t) => TAG_MAP[t] || t.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30))
    .filter(Boolean);
  // Deduplicate, keep first 4
  return [...new Set(mapped)].slice(0, 4);
}

async function crosspost(filePath) {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) {
    console.error("Error: DEVTO_API_KEY environment variable is not set.");
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data: frontmatter, content } = matter(raw);

  const { title, excerpt, slug, categories = [], tags = [], featuredImage, devto_id } = frontmatter;

  if (!title) {
    console.error("Error: Post has no title in frontmatter.");
    process.exit(1);
  }

  const postSlug = slug || path.basename(filePath, path.extname(filePath));
  const canonicalUrl = `${SITE_URL}/blog/${postSlug}`;
  const bodyMarkdown = mdxToMarkdown(content);
  const devtoTags = buildDevToTags(categories, tags);

  const payload = {
    article: {
      title,
      body_markdown: bodyMarkdown,
      published: true,
      canonical_url: canonicalUrl,
      description: excerpt || "",
      tags: devtoTags,
      ...(featuredImage ? { main_image: featuredImage } : {}),
    },
  };

  const isUpdate = Boolean(devto_id);
  const url = isUpdate ? `${DEVTO_API}/${devto_id}` : DEVTO_API;
  const method = isUpdate ? "PUT" : "POST";

  console.log(`${isUpdate ? "Updating" : "Publishing"} "${title}" to dev.to...`);
  console.log(`  Canonical URL: ${canonicalUrl}`);
  console.log(`  Tags: ${devtoTags.join(", ") || "(none)"}`);

  const res = await fetch(url, {
    method,
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(`Error ${res.status}:`, JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log(`✓ Published: ${data.url}`);
  console.log(`  dev.to article ID: ${data.id}`);
  console.log(`  Add "devto_id: ${data.id}" to frontmatter to enable future updates.`);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node scripts/crosspost-devto.js <path-to-post.mdx>");
  process.exit(1);
}

crosspost(filePath).catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
