/**
 * WordPress Content Import Script
 *
 * Imports posts from WordPress XML export files and converts them to MDX.
 * De-duplicates against existing Webflow-exported posts by slug.
 *
 * Usage:
 *   npx tsx scripts/import-wordpress.ts <path-to-export-directory-or-xml-file>
 *
 * Supports:
 *   - Single XML file
 *   - Directory with multiple split XML files
 */

import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");

// Slugs to skip (WordPress defaults, duplicates, non-blog content)
const SKIP_SLUGS = new Set([
  "example-post",
  "example-post-2",
  "example-post-3",
]);

// ─── Simple XML Parsing Helpers ──────────────────────────────

function extractTag(xml: string, tag: string): string {
  const match = xml.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
  );
  return match ? match[1].trim() : "";
}

function extractCDATA(xml: string, tag: string): string {
  const match = xml.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i")
  );
  return match ? match[1].trim() : "";
}

function extractAllItems(xml: string): string[] {
  const items: string[] = [];
  const regex = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = regex.exec(xml)) !== null) {
    items.push(m[1]);
  }
  return items;
}

// ─── HTML → MDX Conversion ──────────────────────────────────

function htmlToMdx(html: string): string {
  if (!html) return "";

  let mdx = html;

  // WordPress-specific cleanup
  mdx = mdx.replace(/<!-- \/?wp:[^>]* -->/g, "");
  mdx = mdx.replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gis, "$1");
  mdx = mdx.replace(/\[gallery[^\]]*\]/gi, "");
  mdx = mdx.replace(/\[embed\](.*?)\[\/embed\]/gi, "$1");

  // Figures
  mdx = mdx.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, "$1");
  mdx = mdx.replace(
    /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi,
    "\n*$1*\n"
  );

  // Headings
  mdx = mdx.replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gis, (_, level, content) => {
    return (
      "\n" + "#".repeat(parseInt(level)) + " " + content.replace(/<[^>]+>/g, "") + "\n"
    );
  });

  // Paragraphs
  mdx = mdx.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n");

  // Formatting
  mdx = mdx.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
  mdx = mdx.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");
  mdx = mdx.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*");
  mdx = mdx.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*");

  // Links
  mdx = mdx.replace(
    /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    "[$2]($1)"
  );

  // Images
  mdx = mdx.replace(
    /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
    "![$2]($1)"
  );
  mdx = mdx.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // Lists
  mdx = mdx.replace(/<ul[^>]*>/gi, "\n");
  mdx = mdx.replace(/<\/ul>/gi, "\n");
  mdx = mdx.replace(/<ol[^>]*>/gi, "\n");
  mdx = mdx.replace(/<\/ol>/gi, "\n");
  mdx = mdx.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1");

  // Blockquotes
  mdx = mdx.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gis, "> $1");

  // Code blocks
  mdx = mdx.replace(
    /<pre[^>]*><code[^>]*class="language-(\w+)"[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
    "\n```$1\n$2\n```\n"
  );
  mdx = mdx.replace(
    /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gis,
    "\n```\n$1\n```\n"
  );
  mdx = mdx.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gis, "\n```\n$1\n```\n");
  mdx = mdx.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // Divs (strip wrapper divs)
  mdx = mdx.replace(/<div[^>]*>/gi, "\n");
  mdx = mdx.replace(/<\/div>/gi, "\n");

  // Line breaks / horizontal rules
  mdx = mdx.replace(/<br\s*\/?>/gi, "\n");
  mdx = mdx.replace(/<hr\s*\/?>/gi, "\n---\n");

  // Strip remaining HTML
  mdx = mdx.replace(/<\/?[^>]+(>|$)/g, "");

  // Decode entities
  mdx = mdx.replace(/&amp;/g, "&");
  mdx = mdx.replace(/&lt;/g, "<");
  mdx = mdx.replace(/&gt;/g, ">");
  mdx = mdx.replace(/&quot;/g, '"');
  mdx = mdx.replace(/&#39;/g, "'");
  mdx = mdx.replace(/&#8217;/g, "'");
  mdx = mdx.replace(/&#8216;/g, "'");
  mdx = mdx.replace(/&#8220;/g, '"');
  mdx = mdx.replace(/&#8221;/g, '"');
  mdx = mdx.replace(/&#8211;/g, "–");
  mdx = mdx.replace(/&#8212;/g, "—");
  mdx = mdx.replace(/&#8230;/g, "...");
  mdx = mdx.replace(/&nbsp;/g, " ");

  // Clean whitespace
  mdx = mdx.replace(/\n{3,}/g, "\n\n");
  return mdx.trim();
}

// ─── Main Import Logic ───────────────────────────────────────

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error(
      "Usage: npx tsx scripts/import-wordpress.ts <path-to-export-dir-or-xml>"
    );
    process.exit(1);
  }

  const resolvedPath = path.resolve(inputPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Path not found: ${resolvedPath}`);
    process.exit(1);
  }

  // Collect XML files
  let xmlFiles: string[] = [];
  const stat = fs.statSync(resolvedPath);
  if (stat.isDirectory()) {
    xmlFiles = fs
      .readdirSync(resolvedPath)
      .filter((f) => f.endsWith(".xml"))
      .map((f) => path.join(resolvedPath, f))
      .sort();
  } else {
    xmlFiles = [resolvedPath];
  }

  console.log(`Found ${xmlFiles.length} XML file(s) to process`);

  // Get existing blog post slugs (from Webflow export)
  const existingSlugs = new Set(
    fs.existsSync(BLOG_DIR)
      ? fs
          .readdirSync(BLOG_DIR)
          .filter((f) => f.endsWith(".mdx"))
          .map((f) => f.replace(/\.mdx$/, ""))
      : []
  );

  console.log(`Existing blog posts: ${existingSlugs.size}`);

  let imported = 0;
  let skippedDuplicate = 0;
  let skippedOther = 0;

  fs.mkdirSync(BLOG_DIR, { recursive: true });

  for (const xmlFile of xmlFiles) {
    console.log(`\nProcessing: ${path.basename(xmlFile)}`);
    const xml = fs.readFileSync(xmlFile, "utf-8");
    const items = extractAllItems(xml);
    let fileImported = 0;

    for (const item of items) {
      const postType = extractTag(item, "wp:post_type");
      if (postType !== "post") continue;

      const status = extractTag(item, "wp:status");
      if (status !== "publish") continue;

      const title = extractCDATA(item, "title") || extractTag(item, "title");
      let slug =
        extractTag(item, "wp:post_name") ||
        title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

      // Normalize slug (underscores → hyphens)
      slug = slug.replace(/_/g, "-");

      // Skip known non-blog posts
      if (SKIP_SLUGS.has(slug)) {
        skippedOther++;
        continue;
      }

      const date = extractTag(item, "wp:post_date");
      const content = extractCDATA(item, "content:encoded");
      const excerpt = extractCDATA(item, "excerpt:encoded");

      // Extract WordPress categories and tags
      const wpCategories: string[] = [];
      const wpTags: string[] = [];
      const catRegex =
        /<category domain="category"[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/gi;
      const tagRegex =
        /<category domain="post_tag"[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/gi;
      let catMatch;
      while ((catMatch = catRegex.exec(item)) !== null) {
        wpCategories.push(
          catMatch[1].toLowerCase().replace(/\s+/g, "-")
        );
      }
      let tagMatch;
      while ((tagMatch = tagRegex.exec(item)) !== null) {
        wpTags.push(tagMatch[1].toLowerCase().replace(/\s+/g, "-"));
      }

      // Check for duplicates
      if (existingSlugs.has(slug)) {
        skippedDuplicate++;
        continue;
      }

      // Extract featured image from postmeta
      let featuredImage = "";
      const thumbnailMatch = item.match(
        /<wp:meta_key>\s*_thumbnail_ext_url\s*<\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/i
      );
      if (thumbnailMatch) {
        featuredImage = thumbnailMatch[1];
      }

      const escapedTitle = title.replace(/"/g, '\\"');
      const escapedExcerpt = (excerpt || "")
        .replace(/"/g, '\\"')
        .replace(/\n/g, " ")
        .slice(0, 200);

      const frontmatter = [
        "---",
        `title: "${escapedTitle}"`,
        `slug: "${slug}"`,
        `date: "${date ? new Date(date).toISOString().split("T")[0] : ""}"`,
        `excerpt: "${escapedExcerpt}"`,
        `featuredImage: "${featuredImage}"`,
        `categories: ${JSON.stringify(wpCategories)}`,
        `tags: ${JSON.stringify(wpTags)}`,
        `organizations: []`,
        `skills: []`,
        `source: "wordpress"`,
        "---",
      ].join("\n");

      const mdxContent = htmlToMdx(content);
      const fileContent = `${frontmatter}\n\n${mdxContent}\n`;

      fs.writeFileSync(
        path.join(BLOG_DIR, `${slug}.mdx`),
        fileContent,
        "utf-8"
      );
      existingSlugs.add(slug); // prevent cross-file duplicates
      imported++;
      fileImported++;
    }

    console.log(`  → Imported ${fileImported} posts from this file`);
  }

  console.log(`\nWordPress Import Complete:`);
  console.log(`  Imported: ${imported} new posts`);
  console.log(`  Skipped (already exist): ${skippedDuplicate}`);
  console.log(`  Skipped (excluded): ${skippedOther}`);
  console.log(`  Total blog posts now: ${existingSlugs.size}`);
}

main();
