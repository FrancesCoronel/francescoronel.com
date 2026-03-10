/**
 * Import missing posts from personal-website-v3 (Hugo) into the Next.js site.
 *
 * Usage: node scripts/import-hugo-v3.js <path-to-v3-content-posts-dir>
 *
 * - Parses Hugo YAML frontmatter
 * - Skips posts that already exist (by slug)
 * - Converts content to MDX-safe format
 * - Collects aliases for redirect generation
 */

const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const REDIRECTS_OUT = path.join(process.cwd(), "scripts", "hugo-v3-aliases.json");

// ─── YAML frontmatter parser (simple, no deps) ────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const yamlStr = match[1];
  const body = match[2];
  const data = {};

  let currentKey = null;
  let inList = false;
  let listItems = [];

  for (const line of yamlStr.split("\n")) {
    // List item
    if (inList && /^\s+-\s+(.*)/.test(line)) {
      const val = line.match(/^\s+-\s+(.*)/)[1].replace(/^["']|["']$/g, "").trim();
      listItems.push(val);
      continue;
    }

    // End of list
    if (inList && !/^\s+-/.test(line)) {
      data[currentKey] = listItems;
      inList = false;
      listItems = [];
      currentKey = null;
    }

    // Key: value pair
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1];
      let val = kvMatch[2].trim();

      if (val === "" || val === "[]") {
        // Could be start of a list or empty value
        currentKey = key;
        if (val === "[]") {
          data[key] = [];
        } else {
          inList = true;
          listItems = [];
        }
        continue;
      }

      // Strip quotes
      val = val.replace(/^["']|["']$/g, "");

      // Boolean
      if (val === "true") val = true;
      else if (val === "false") val = false;

      data[key] = val;
      currentKey = key;
    }
  }

  // Flush remaining list
  if (inList && currentKey) {
    data[currentKey] = listItems;
  }

  return { data, body };
}

// ─── MDX content sanitizer ─────────────────────────────────────

function sanitizeForMdx(content) {
  const lines = content.split("\n");
  let inCodeBlock = false;

  return lines
    .map((line) => {
      if (line.trimStart().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return line;
      }
      if (inCodeBlock) return line;

      // Strip iframes, script tags, and other raw HTML that MDX can't handle
      if (/<iframe/i.test(line) || /<script/i.test(line) || /<style/i.test(line)) {
        // Convert iframe to a link if src is available
        const srcMatch = line.match(/src="([^"]*)"/);
        if (srcMatch) return `[Embedded content](${srcMatch[1]})`;
        return "";
      }

      // Escape bare < outside inline code
      const parts = line.split(/(`[^`]*`)/g);
      return parts
        .map((part, i) => {
          if (i % 2 === 1) return part; // inline code
          return part.replace(/</g, "&lt;");
        })
        .join("");
    })
    .join("\n");
}

// ─── Main ──────────────────────────────────────────────────────

const postsDir = process.argv[2];
if (!postsDir) {
  console.error("Usage: node scripts/import-hugo-v3.js <path-to-v3-content-posts-dir>");
  process.exit(1);
}

// Get existing slugs
const existingSlugs = new Set(
  fs.existsSync(BLOG_DIR)
    ? fs
        .readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(/\.mdx$/, ""))
    : []
);

console.log(`Existing blog posts: ${existingSlugs.size}`);

const files = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

console.log(`Hugo v3 posts to process: ${files.length}`);

fs.mkdirSync(BLOG_DIR, { recursive: true });

let imported = 0;
let skipped = 0;
const aliases = []; // Collect for redirect generation

for (const file of files) {
  // Extract slug from filename: YYYY-MM-DD-slug.md
  const slugMatch = file.match(/^\d{4}-\d{2}-\d{2}-(.*?)\.md$/);
  if (!slugMatch) continue;

  const slug = slugMatch[1];

  if (existingSlugs.has(slug)) {
    skipped++;
    continue;
  }

  const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
  const { data, body } = parseFrontmatter(raw);

  const title = (data.title || slug).replace(/"/g, '\\"');
  const date = data.date || file.slice(0, 10);
  const excerpt = ((data.description || "").toString()).replace(/"/g, '\\"').replace(/\n/g, " ").slice(0, 200);
  const featuredImage = data.image || "";
  const categories = Array.isArray(data.categories) ? data.categories.map((c) => c.toLowerCase().replace(/\s+/g, "-")) : [];
  const tags = Array.isArray(data.tags) ? data.tags.map((t) => t.toLowerCase().replace(/\s+/g, "-")) : [];

  // Collect aliases for redirect generation
  if (data.aliases && Array.isArray(data.aliases)) {
    for (const alias of data.aliases) {
      aliases.push({ source: alias.replace(/\/$/, ""), destination: `/blog/${slug}` });
    }
  }
  if (data.url) {
    const urlClean = data.url.toString().replace(/\/$/, "");
    if (urlClean && urlClean !== `/blog/${slug}`) {
      aliases.push({ source: urlClean, destination: `/blog/${slug}` });
    }
  }

  const frontmatterLines = [
    "---",
    `title: "${title}"`,
    `slug: "${slug}"`,
    `date: "${typeof date === "string" ? date.slice(0, 10) : new Date(date).toISOString().split("T")[0]}"`,
    `excerpt: "${excerpt}"`,
    `featuredImage: "${featuredImage}"`,
    `categories: ${JSON.stringify(categories)}`,
    `tags: ${JSON.stringify(tags)}`,
    `organizations: []`,
    `skills: []`,
    `source: "hugo"`,
    "---",
  ];

  const sanitized = sanitizeForMdx(body);
  const fileContent = frontmatterLines.join("\n") + "\n\n" + sanitized.trim() + "\n";

  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), fileContent, "utf-8");
  existingSlugs.add(slug);
  imported++;
}

// Write aliases for redirect config
fs.writeFileSync(REDIRECTS_OUT, JSON.stringify(aliases, null, 2), "utf-8");

console.log(`\nHugo v3 Import Complete:`);
console.log(`  Imported: ${imported} new posts`);
console.log(`  Skipped (already exist): ${skipped}`);
console.log(`  Total blog posts now: ${existingSlugs.size}`);
console.log(`  Aliases collected: ${aliases.length} → saved to ${REDIRECTS_OUT}`);
