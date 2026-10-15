#!/usr/bin/env node
/**
 * Cross-post a blog post to Hashnode.
 *
 * Usage:
 *   node scripts/crosspost-hashnode.js content/posts/my-post.mdx
 *
 * Required env vars:
 *   HASHNODE_TOKEN          — Personal access token (hashnode.com/settings/developer)
 *
 * Optional env vars:
 *   HASHNODE_PUBLICATION_ID — Publication to post to (defaults to your first one)
 *
 * The script:
 *   1. Reads frontmatter (title, excerpt, tags, featuredImage)
 *   2. Strips MDX-specific syntax for plain Markdown
 *   3. Publishes to Hashnode with originalArticleURL pointing back to francescoronel.com
 *   4. Prints the published URL on success
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { mdxToMarkdown } = require("./crosspost-devto");

const SITE_URL = "https://www.francescoronel.com";
const HASHNODE_API = "https://gql.hashnode.com/";

async function gql(token, query, variables = {}) {
  const res = await fetch(HASHNODE_API, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  // Hashnode sometimes answers with an HTML error page, and GraphQL errors come back as 200
  const body = await res.text();
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(`Hashnode ${res.status}: ${body.slice(0, 200)}`);
  }
  if (!res.ok || data.errors) {
    throw new Error(`Hashnode ${res.status}: ${JSON.stringify(data.errors || data)}`);
  }
  return data.data;
}

// Hashnode tags are { slug, name } objects, max 5
function buildTags(categories = [], tags = []) {
  const seen = new Set();
  return [...categories, ...tags]
    .map((t) => ({
      slug: String(t).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, ""),
      name: String(t),
    }))
    .filter((t) => t.slug && !seen.has(t.slug) && seen.add(t.slug))
    .slice(0, 5);
}

async function crosspost(filePath) {
  const token = process.env.HASHNODE_TOKEN;
  if (!token) {
    console.error("Error: HASHNODE_TOKEN environment variable is not set.");
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const { data: frontmatter, content } = matter(fs.readFileSync(filePath, "utf8"));
  const { title, excerpt, slug, categories = [], tags = [], featuredImage, crosspost: enabled } = frontmatter;

  if (enabled === false) {
    console.log(`Skipping ${filePath}: crosspost is false in frontmatter.`);
    return;
  }
  if (!title) {
    console.error("Error: Post has no title in frontmatter.");
    process.exit(1);
  }

  let publicationId = process.env.HASHNODE_PUBLICATION_ID;
  if (!publicationId) {
    const data = await gql(token, `query { me { publications(first: 1) { edges { node { id } } } } }`);
    publicationId = data.me.publications.edges[0]?.node.id;
    if (!publicationId) {
      console.error("Error: No Hashnode publication found for this token.");
      process.exit(1);
    }
  }

  const postSlug = slug || path.basename(filePath, path.extname(filePath));
  const canonicalUrl = `${SITE_URL}/posts/${postSlug}`;

  const input = {
    title,
    publicationId,
    contentMarkdown: mdxToMarkdown(content),
    originalArticleURL: canonicalUrl,
    tags: buildTags(categories, tags),
    ...(excerpt ? { subtitle: excerpt.slice(0, 150) } : {}),
    ...(featuredImage ? { coverImageOptions: { coverImageURL: featuredImage } } : {}),
  };

  console.log(`Publishing "${title}" to Hashnode...`);
  console.log(`  Canonical URL: ${canonicalUrl}`);

  const data = await gql(
    token,
    `mutation Publish($input: PublishPostInput!) {
      publishPost(input: $input) { post { id url } }
    }`,
    { input }
  );

  console.log(`✓ Published: ${data.publishPost.post.url}`);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node scripts/crosspost-hashnode.js <path-to-post.mdx>");
  process.exit(1);
}

crosspost(filePath).catch((err) => {
  console.error("Unexpected error:", err.message || err);
  process.exit(1);
});
