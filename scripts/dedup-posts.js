/**
 * Deduplicates blog posts by normalized title.
 *
 * For each group of duplicates:
 *   1. Keeps the version with the most content (best quality)
 *   2. Deletes the shorter duplicates
 *   3. Outputs redirect entries for deleted slugs → kept slug
 *
 * Usage: node scripts/dedup-posts.js [--dry-run]
 */

const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const REDIRECTS_OUT = path.join(process.cwd(), "scripts", "dedup-redirects.json");
const isDryRun = process.argv.includes("--dry-run");

// Source priority: webflow > wordpress > hugo (prefer more recent platform data)
const SOURCE_PRIORITY = { webflow: 3, wordpress: 2, hugo: 1, undefined: 0 };

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { title: "", source: "", body: content, slug: "" };

  const yaml = match[1];
  const body = match[2];

  const titleMatch = yaml.match(/^title:\s*"(.*?)"/m);
  const sourceMatch = yaml.match(/^source:\s*"(.*?)"/m);
  const slugMatch = yaml.match(/^slug:\s*"(.*?)"/m);

  return {
    title: titleMatch ? titleMatch[1] : "",
    source: sourceMatch ? sourceMatch[1] : "",
    slug: slugMatch ? slugMatch[1] : "",
    body: body.trim(),
  };
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Main ──────────────────────────────────────────────────────

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
console.log(`Total blog posts: ${files.length}`);

// Group by normalized title
const groups = {};
for (const file of files) {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
  const { title, source, body } = parseFrontmatter(raw);
  const norm = normalizeTitle(title);

  if (!norm) continue;

  if (!groups[norm]) groups[norm] = [];
  groups[norm].push({
    slug,
    file,
    title,
    source,
    bodyLength: body.length,
    priority: SOURCE_PRIORITY[source] || 0,
  });
}

// Find duplicates and pick winners
const duplicateGroups = Object.entries(groups).filter(([, posts]) => posts.length > 1);
console.log(`Duplicate groups: ${duplicateGroups.length}`);

let totalDeleted = 0;
const redirects = [];
const report = [];

for (const [normTitle, posts] of duplicateGroups) {
  // Sort by: source priority (desc), then body length (desc)
  posts.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.bodyLength - a.bodyLength;
  });

  const winner = posts[0];
  const losers = posts.slice(1);

  report.push({
    title: winner.title,
    kept: `${winner.slug} (${winner.source || "unknown"}, ${winner.bodyLength} chars)`,
    deleted: losers.map(
      (l) => `${l.slug} (${l.source || "unknown"}, ${l.bodyLength} chars)`
    ),
  });

  for (const loser of losers) {
    redirects.push({
      source: `/blog/${loser.slug}`,
      destination: `/blog/${winner.slug}`,
      permanent: true,
    });

    if (!isDryRun) {
      fs.unlinkSync(path.join(BLOG_DIR, loser.file));
    }
    totalDeleted++;
  }
}

// Write redirects
fs.writeFileSync(REDIRECTS_OUT, JSON.stringify(redirects, null, 2), "utf-8");

// Summary
console.log(`\nDeduplication ${isDryRun ? "(DRY RUN)" : "Complete"}:`);
console.log(`  Duplicate groups: ${duplicateGroups.length}`);
console.log(`  Posts deleted: ${totalDeleted}`);
console.log(`  Posts remaining: ${files.length - totalDeleted}`);
console.log(`  Redirects saved: ${redirects.length} → ${REDIRECTS_OUT}`);

// Show first 30 actions
console.log(`\nActions taken (first 30):`);
for (const r of report.slice(0, 30)) {
  console.log(`  KEPT: ${r.kept}`);
  for (const d of r.deleted) {
    console.log(`    DEL: ${d}`);
  }
}
if (report.length > 30) {
  console.log(`  ... and ${report.length - 30} more groups`);
}
