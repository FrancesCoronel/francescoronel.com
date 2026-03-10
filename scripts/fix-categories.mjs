/**
 * Fix blog post categories to match canonical list.
 * Usage: node scripts/fix-categories.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const BLOG_DIR = join(process.cwd(), "content/blog");

// Canonical categories
const CANONICAL = new Set([
  "awards", "blog", "education", "events", "experience",
  "freelancing", "mentoring", "newsletter", "philanthrophy",
  "podcast", "portfolio", "press", "programs", "speaking"
]);

// Mapping of old → new slugs
const REMAP = {
  "code-career": "blog",
  "cultura": "blog",
  "tech-queens-podcast": "podcast",
  "volunteering": "philanthrophy",
  "testimonials": "blog",
  "talk": "speaking",
  "research": "blog",
  "presentation": "speaking",
  "mobile": "portfolio",
  "design": "portfolio",
};

const files = readdirSync(BLOG_DIR).filter(f => f.endsWith(".mdx"));
let totalUpdated = 0;
let totalRemapped = 0;

for (const file of files) {
  const filePath = join(BLOG_DIR, file);
  const content = readFileSync(filePath, "utf-8");

  // Match the categories line in frontmatter
  const catMatch = content.match(/^categories:\s*\[([^\]]*)\]/m);
  if (!catMatch) continue;

  const rawCats = catMatch[1]
    .split(",")
    .map(c => c.trim().replace(/^["']|["']$/g, ""))
    .filter(c => c.length > 0);

  let changed = false;
  const newCats = [];

  for (const cat of rawCats) {
    if (REMAP[cat]) {
      newCats.push(REMAP[cat]);
      changed = true;
      totalRemapped++;
    } else if (CANONICAL.has(cat)) {
      newCats.push(cat);
    } else {
      // Unknown category — map to blog
      newCats.push("blog");
      changed = true;
      totalRemapped++;
      console.log(`  Unknown category "${cat}" in ${file} → blog`);
    }
  }

  // Deduplicate
  const dedupCats = [...new Set(newCats)];
  if (dedupCats.length !== newCats.length) changed = true;

  // If empty, default to blog
  if (dedupCats.length === 0) {
    dedupCats.push("blog");
    changed = true;
  }

  if (changed) {
    const newCatLine = `categories: [${dedupCats.map(c => `"${c}"`).join(", ")}]`;
    const newContent = content.replace(/^categories:\s*\[([^\]]*)\]/m, newCatLine);
    writeFileSync(filePath, newContent);
    totalUpdated++;
  }
}

console.log(`\n=== Category Fix Summary ===`);
console.log(`Files updated:      ${totalUpdated}`);
console.log(`Categories remapped: ${totalRemapped}`);
