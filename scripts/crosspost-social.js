#!/usr/bin/env node
/**
 * Share a new blog post to social networks through Buffer.
 *
 * Usage:
 *   node scripts/crosspost-social.js content/posts/my-post.mdx
 *   node scripts/crosspost-social.js content/posts/my-post.mdx --dry-run
 *
 * Required env vars:
 *   BUFFER_API_KEY — Buffer API key (publish.buffer.com/settings/api)
 *
 * Optional env vars:
 *   BUFFER_SERVICES — comma-separated networks to post to
 *                     (default: "linkedin,bluesky,threads")
 *   BUFFER_MODE     — "draft" (default) saves posts as Buffer drafts to review;
 *                     "queue" adds them straight to the posting queue
 *
 * The script:
 *   1. Reads frontmatter (title, excerpt, slug, social, crosspost)
 *   2. Writes a short post per network that fits its character limit
 *   3. Finds the connected Buffer channels for those networks
 *   4. Creates a draft (or queued post) on each channel
 *
 * Frontmatter controls:
 *   social: "Custom intro text"  — used instead of the excerpt
 *   crosspost: false             — skip this post entirely
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = "https://www.francescoronel.com";
const BUFFER_API = "https://api.buffer.com";

// Max characters per network (links count toward the limit on all three)
const CHAR_LIMITS = {
  bluesky: 300,
  threads: 500,
  linkedin: 3000,
  mastodon: 500,
  twitter: 280,
};
const DEFAULT_LIMIT = 500;

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : cut.length).trimEnd()}…`;
}

function buildText(service, { title, intro, url }) {
  const limit = CHAR_LIMITS[service] || DEFAULT_LIMIT;
  const head = intro ? `${title}\n\n` : "";
  const tail = `\n\n${url}`;
  const room = limit - head.length - tail.length;
  const body = intro && room > 20 ? truncate(intro, room) : "";
  return body ? `${head}${body}${tail}` : truncate(title, limit - tail.length) + tail;
}

async function buffer(apiKey, query, variables = {}) {
  const res = await fetch(BUFFER_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json();
  if (!res.ok || data.errors) {
    throw new Error(`Buffer API ${res.status}: ${JSON.stringify(data.errors || data)}`);
  }
  return data.data;
}

async function getChannels(apiKey, services) {
  const { account } = await buffer(apiKey, `query { account { organizations { id name } } }`);
  const channels = [];
  for (const org of account.organizations) {
    const data = await buffer(
      apiKey,
      `query Channels($orgId: OrganizationId!) {
        channels(input: { organizationId: $orgId }) { id name service }
      }`,
      { orgId: org.id }
    );
    channels.push(...data.channels);
  }
  return channels.filter((c) => services.includes(String(c.service).toLowerCase()));
}

async function createPost(apiKey, { channelId, text, saveToDraft }) {
  const data = await buffer(
    apiKey,
    `mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess { post { id dueAt } }
        ... on MutationError { message }
      }
    }`,
    {
      input: {
        text,
        channelId,
        schedulingType: "automatic",
        mode: "addToQueue",
        saveToDraft,
        assets: [],
      },
    }
  );
  const result = data.createPost;
  if (!result.post) throw new Error(result.message || "Unknown Buffer error");
  return result.post;
}

async function crosspost(filePath, { dryRun }) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const { data: frontmatter } = matter(fs.readFileSync(filePath, "utf8"));
  const { title, excerpt, slug, social, crosspost: enabled } = frontmatter;

  if (enabled === false) {
    console.log(`Skipping ${filePath}: crosspost is false in frontmatter.`);
    return;
  }
  if (!title) {
    console.error("Error: Post has no title in frontmatter.");
    process.exit(1);
  }

  const postSlug = slug || path.basename(filePath, path.extname(filePath));
  const url = `${SITE_URL}/posts/${postSlug}`;
  const intro = (social || excerpt || "").trim();
  const services = (process.env.BUFFER_SERVICES || "linkedin,bluesky,threads")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const saveToDraft = (process.env.BUFFER_MODE || "draft") !== "queue";

  if (dryRun) {
    for (const service of services) {
      const text = buildText(service, { title, intro, url });
      console.log(`--- ${service} (${text.length} chars) ---\n${text}\n`);
    }
    return;
  }

  const apiKey = process.env.BUFFER_API_KEY;
  if (!apiKey) {
    console.error("Error: BUFFER_API_KEY environment variable is not set.");
    process.exit(1);
  }

  const channels = await getChannels(apiKey, services);
  if (channels.length === 0) {
    console.error(`Error: No Buffer channels connected for: ${services.join(", ")}`);
    process.exit(1);
  }

  console.log(`${saveToDraft ? "Drafting" : "Queuing"} "${title}" on Buffer...`);
  let failed = 0;
  for (const channel of channels) {
    const service = String(channel.service).toLowerCase();
    const text = buildText(service, { title, intro, url });
    try {
      const post = await createPost(apiKey, { channelId: channel.id, text, saveToDraft });
      console.log(`✓ ${service} (${channel.name}): ${post.id}${post.dueAt ? ` due ${post.dueAt}` : ""}`);
    } catch (err) {
      failed++;
      console.error(`✗ ${service} (${channel.name}): ${err.message}`);
    }
  }
  if (failed) process.exit(1);
}

const args = process.argv.slice(2);
const filePath = args.find((a) => !a.startsWith("--"));
if (!filePath) {
  console.error("Usage: node scripts/crosspost-social.js <path-to-post.mdx> [--dry-run]");
  process.exit(1);
}

crosspost(filePath, { dryRun: args.includes("--dry-run") }).catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
