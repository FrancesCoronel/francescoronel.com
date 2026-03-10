/**
 * Webflow CMS Export Script
 *
 * Fetches all CMS items from the Webflow API and converts them to local
 * content files (MDX for blog posts, JSON for structured data).
 *
 * Prerequisites:
 *   1. Set WEBFLOW_API_TOKEN in .env.local
 *   2. Set WEBFLOW_SITE_ID in .env.local
 *   3. Run: npx tsx scripts/export-webflow.ts
 *
 * The script will:
 *   - Fetch all CMS collections and their items
 *   - Convert blog post rich text HTML → MDX
 *   - Resolve CMS reference fields (categories, tags, orgs) to slugs
 *   - Write blog posts as individual MDX files in content/blog/
 *   - Write structured data as JSON files in content/
 */

import fs from "fs";
import path from "path";

const API_BASE = "https://api.webflow.com/v2";
const TOKEN = process.env.WEBFLOW_API_TOKEN;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

if (!TOKEN || !SITE_ID) {
  console.error("Missing WEBFLOW_API_TOKEN or WEBFLOW_SITE_ID in environment");
  process.exit(1);
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");

// ─── Webflow API Helpers ─────────────────────────────────────

async function webflowFetch(endpoint: string) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Webflow API error: ${res.status} ${res.statusText} — ${endpoint}`);
  }
  return res.json();
}

async function fetchAllItems(collectionId: string) {
  const items: Record<string, unknown>[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const data = await webflowFetch(
      `/collections/${collectionId}/items?limit=${limit}&offset=${offset}`
    );
    items.push(...data.items);
    if (items.length >= data.pagination.total) break;
    offset += limit;
  }

  return items;
}

async function fetchCollections() {
  const data = await webflowFetch(`/sites/${SITE_ID}/collections`);
  return data.collections as Array<{
    id: string;
    slug: string;
    displayName: string;
  }>;
}

// ─── HTML → MDX Conversion ──────────────────────────────────

function htmlToMdx(html: string): string {
  if (!html) return "";

  let mdx = html;

  // Remove Webflow-specific attributes
  mdx = mdx.replace(/\s+class="[^"]*"/g, "");
  mdx = mdx.replace(/\s+id="[^"]*"/g, "");
  mdx = mdx.replace(/\s+data-[a-z-]+="[^"]*"/g, "");

  // Convert headings
  mdx = mdx.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n");
  mdx = mdx.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n");
  mdx = mdx.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n");
  mdx = mdx.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n#### $1\n");
  mdx = mdx.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "\n##### $1\n");
  mdx = mdx.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "\n###### $1\n");

  // Convert paragraphs
  mdx = mdx.replace(/<p[^>]*>(.*?)<\/p>/gis, "\n$1\n");

  // Convert bold, italic, links
  mdx = mdx.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  mdx = mdx.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  mdx = mdx.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  mdx = mdx.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
  mdx = mdx.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");

  // Convert images
  mdx = mdx.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  mdx = mdx.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // Convert lists
  mdx = mdx.replace(/<ul[^>]*>/gi, "\n");
  mdx = mdx.replace(/<\/ul>/gi, "\n");
  mdx = mdx.replace(/<ol[^>]*>/gi, "\n");
  mdx = mdx.replace(/<\/ol>/gi, "\n");
  mdx = mdx.replace(/<li[^>]*>(.*?)<\/li>/gis, "- $1");

  // Convert blockquotes
  mdx = mdx.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, "> $1");

  // Convert code blocks and inline code
  mdx = mdx.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, "\n```\n$1\n```\n");
  mdx = mdx.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");

  // Convert line breaks
  mdx = mdx.replace(/<br\s*\/?>/gi, "\n");

  // Strip remaining HTML tags
  mdx = mdx.replace(/<\/?[^>]+(>|$)/g, "");

  // Decode HTML entities
  mdx = mdx.replace(/&amp;/g, "&");
  mdx = mdx.replace(/&lt;/g, "<");
  mdx = mdx.replace(/&gt;/g, ">");
  mdx = mdx.replace(/&quot;/g, '"');
  mdx = mdx.replace(/&#39;/g, "'");
  mdx = mdx.replace(/&nbsp;/g, " ");

  // Clean up extra whitespace
  mdx = mdx.replace(/\n{3,}/g, "\n\n");
  return mdx.trim();
}

// ─── Main Export Logic ───────────────────────────────────────

interface RefMap {
  [id: string]: string; // Webflow item ID → slug
}

async function main() {
  console.log("Fetching collections...");
  const collections = await fetchCollections();

  // Build a map of collection slug → collection ID
  const collectionMap: Record<string, string> = {};
  for (const col of collections) {
    collectionMap[col.slug] = col.id;
    console.log(`  Found collection: ${col.displayName} (${col.slug})`);
  }

  // ─── Fetch reference collections first (for ID → slug mapping) ──

  const refMaps: Record<string, RefMap> = {};
  const refCollections = ["categories", "tags", "organizations", "skills"];

  for (const slug of refCollections) {
    const colId = collectionMap[slug];
    if (!colId) {
      console.warn(`  Collection "${slug}" not found, skipping`);
      continue;
    }
    console.log(`Fetching ${slug}...`);
    const items = await fetchAllItems(colId);
    const map: RefMap = {};
    for (const item of items) {
      const fieldData = item.fieldData as Record<string, unknown>;
      map[item.id as string] = (fieldData.slug as string) || "";
    }
    refMaps[slug] = map;
  }

  // Helper to resolve an array of Webflow IDs to slugs
  function resolveRefs(ids: string[] | undefined, collection: string): string[] {
    if (!ids || !refMaps[collection]) return [];
    return ids.map((id) => refMaps[collection][id]).filter(Boolean);
  }

  // ─── Export Blog Posts ─────────────────────────────────────

  const blogColId = collectionMap["blog-posts"] || collectionMap["blog"] || collectionMap["posts"];
  if (blogColId) {
    console.log("Fetching blog posts...");
    const posts = await fetchAllItems(blogColId);
    console.log(`  Found ${posts.length} blog posts`);

    fs.mkdirSync(BLOG_DIR, { recursive: true });

    for (const post of posts) {
      const fd = post.fieldData as Record<string, unknown>;
      const slug = (fd.slug as string) || "";
      const title = ((fd.name as string) || (fd.title as string) || "").replace(/"/g, '\\"');
      const date = (fd["published-date"] as string) || (fd.date as string) || (post.createdOn as string) || "";
      const excerpt = ((fd.excerpt as string) || (fd.summary as string) || "").replace(/"/g, '\\"');
      const featuredImage = (fd["featured-image"] as { url: string })?.url || (fd["main-image"] as { url: string })?.url || "";
      const body = (fd["post-body"] as string) || (fd.body as string) || (fd.content as string) || "";

      const categories = resolveRefs(fd.categories as string[], "categories");
      const tags = resolveRefs(fd.tags as string[], "tags");
      const organizations = resolveRefs(fd.organizations as string[], "organizations");
      const skills = resolveRefs(fd.skills as string[], "skills");
      const externalUrl = (fd["external-url"] as string) || "";

      const frontmatter = [
        "---",
        `title: "${title}"`,
        `slug: "${slug}"`,
        `date: "${date ? new Date(date).toISOString().split("T")[0] : ""}"`,
        `excerpt: "${excerpt}"`,
        `featuredImage: "${featuredImage}"`,
        `categories: ${JSON.stringify(categories)}`,
        `tags: ${JSON.stringify(tags)}`,
        `organizations: ${JSON.stringify(organizations)}`,
        `skills: ${JSON.stringify(skills)}`,
        externalUrl ? `externalUrl: "${externalUrl}"` : null,
        `source: "webflow"`,
        "---",
      ]
        .filter(Boolean)
        .join("\n");

      const mdxContent = htmlToMdx(body);
      const fileContent = `${frontmatter}\n\n${mdxContent}\n`;

      fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), fileContent, "utf-8");
    }
    console.log(`  Wrote ${posts.length} MDX files to content/blog/`);
  }

  // ─── Export Structured Data Collections ────────────────────

  const dataExports: Array<{
    collectionSlugs: string[];
    outputFile: string;
    transform: (item: Record<string, unknown>) => Record<string, unknown>;
  }> = [
    {
      collectionSlugs: ["testimonials"],
      outputFile: "testimonials.json",
      transform: (item) => {
        const fd = item.fieldData as Record<string, unknown>;
        return {
          name: fd.name || fd.title || "",
          slug: fd.slug || "",
          role: fd.role || fd.position || "",
          organization: fd.organization || fd.company || "",
          quote: fd.quote || fd.testimonial || fd.body || "",
          image: (fd.image as { url: string })?.url || (fd.photo as { url: string })?.url || "",
          featured: fd.featured || false,
        };
      },
    },
    {
      collectionSlugs: ["organizations"],
      outputFile: "organizations.json",
      transform: (item) => {
        const fd = item.fieldData as Record<string, unknown>;
        return {
          name: fd.name || "",
          slug: fd.slug || "",
          logo: (fd.logo as { url: string })?.url || (fd.image as { url: string })?.url || "",
          url: fd.url || fd.website || "",
          type: fd.type || "community",
          description: fd.description || "",
        };
      },
    },
    {
      collectionSlugs: ["skills"],
      outputFile: "skills.json",
      transform: (item) => {
        const fd = item.fieldData as Record<string, unknown>;
        return {
          name: fd.name || "",
          slug: fd.slug || "",
          category: fd.category || "",
          icon: fd.icon || "",
          proficiency: fd.proficiency || 0,
        };
      },
    },
    {
      collectionSlugs: ["awards"],
      outputFile: "awards.json",
      transform: (item) => {
        const fd = item.fieldData as Record<string, unknown>;
        return {
          title: fd.name || fd.title || "",
          slug: fd.slug || "",
          organization: fd.organization || fd.issuer || "",
          date: fd.date || "",
          description: fd.description || "",
          image: (fd.image as { url: string })?.url || "",
          url: fd.url || "",
        };
      },
    },
    {
      collectionSlugs: ["work-experiences", "experiences"],
      outputFile: "experience.json",
      transform: (item) => {
        const fd = item.fieldData as Record<string, unknown>;
        return {
          title: fd.title || fd.name || fd["job-title"] || "",
          slug: fd.slug || "",
          company: fd.company || fd.organization || "",
          companyLogo: (fd["company-logo"] as { url: string })?.url || (fd.logo as { url: string })?.url || "",
          companyUrl: fd["company-url"] || fd.url || "",
          location: fd.location || "",
          startDate: fd["start-date"] || "",
          endDate: fd["end-date"] || null,
          description: fd.description || "",
          highlights: (fd.highlights as string[]) || [],
          skills: resolveRefs(fd.skills as string[], "skills"),
        };
      },
    },
    {
      collectionSlugs: ["educational-institutions", "education"],
      outputFile: "education.json",
      transform: (item) => {
        const fd = item.fieldData as Record<string, unknown>;
        return {
          institution: fd.name || fd.institution || "",
          slug: fd.slug || "",
          degree: fd.degree || "",
          field: fd.field || fd["field-of-study"] || "",
          logo: (fd.logo as { url: string })?.url || (fd.image as { url: string })?.url || "",
          url: fd.url || fd.website || "",
          startDate: fd["start-date"] || "",
          endDate: fd["end-date"] || "",
          description: fd.description || "",
          honors: (fd.honors as string[]) || [],
        };
      },
    },
    {
      collectionSlugs: ["categories"],
      outputFile: "categories.json",
      transform: (item) => {
        const fd = item.fieldData as Record<string, unknown>;
        return {
          name: fd.name || "",
          slug: fd.slug || "",
          color: fd.color || "",
          description: fd.description || "",
        };
      },
    },
    {
      collectionSlugs: ["tags"],
      outputFile: "tags.json",
      transform: (item) => {
        const fd = item.fieldData as Record<string, unknown>;
        return {
          name: fd.name || "",
          slug: fd.slug || "",
        };
      },
    },
  ];

  for (const { collectionSlugs, outputFile, transform } of dataExports) {
    let colId: string | undefined;
    let matchedSlug = "";
    for (const slug of collectionSlugs) {
      if (collectionMap[slug]) {
        colId = collectionMap[slug];
        matchedSlug = slug;
        break;
      }
    }
    if (!colId) {
      console.warn(`  No collection found for ${collectionSlugs.join("/")}, writing empty ${outputFile}`);
      continue;
    }

    console.log(`Fetching ${matchedSlug}...`);
    const items = await fetchAllItems(colId);
    const data = items.map(transform);
    fs.writeFileSync(
      path.join(CONTENT_DIR, outputFile),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    console.log(`  Wrote ${data.length} items to content/${outputFile}`);
  }

  console.log("\nExport complete!");
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
