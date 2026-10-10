#!/usr/bin/env node
/**
 * Create a Resend broadcast draft announcing a new blog post.
 *
 * Usage:
 *   node scripts/newsletter-broadcast.js content/posts/my-post.mdx
 *
 * Required env vars:
 *   RESEND_API_KEY    — Resend API key with full access (Resend → API Keys)
 *   RESEND_SEGMENT_ID — the segment subscribers belong to (Resend → Audience → Segments)
 *   RESEND_FROM       — verified sender, e.g. "Frances Coronel <newsletter@francescoronel.com>"
 *
 * Optional env vars:
 *   RESEND_SEND_NOW=true — send immediately instead of leaving a draft
 *
 * The script:
 *   1. Reads frontmatter (title, slug, excerpt, featuredImage, draft)
 *   2. Waits until the post URL is live (Vercel deploys after the push)
 *   3. Creates a broadcast with the title, excerpt, image and a link to the post
 *   4. Leaves it as a draft in Resend unless RESEND_SEND_NOW=true
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = "https://www.francescoronel.com";
const RESEND_API = "https://api.resend.com/broadcasts";
const LIVE_TIMEOUT_MS = 15 * 60 * 1000;
const LIVE_POLL_MS = 30 * 1000;

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml({ title, excerpt, featuredImage, url }) {
  const image = featuredImage
    ? `<img src="${escapeHtml(featuredImage)}" alt="" width="560" style="width:100%;max-width:560px;height:auto;border-radius:12px;margin:0 0 24px;" />`
    : "";
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f9f5f3;font-family:Helvetica,Arial,sans-serif;color:#253137;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:#ca2e55;">New post</p>
      <h1 style="margin:0 0 24px;font-size:26px;line-height:1.3;">${escapeHtml(title)}</h1>
      ${image}
      <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">${escapeHtml(excerpt)}</p>
      <a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#ca2e55;color:#ffffff;text-decoration:none;font-weight:bold;">Read the full post</a>
      <p style="margin:40px 0 0;font-size:12px;color:#6b7a80;">
        You're getting this because you subscribed at francescoronel.com.
        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#6b7a80;">Unsubscribe</a>
      </p>
    </div>
  </body>
</html>`;
}

async function waitUntilLive(url) {
  const deadline = Date.now() + LIVE_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "follow" });
      if (res.ok) return true;
      console.log(`  ${url} returned ${res.status}, waiting for deploy…`);
    } catch (err) {
      console.log(`  ${url} not reachable (${err.message}), waiting for deploy…`);
    }
    await new Promise((r) => setTimeout(r, LIVE_POLL_MS));
  }
  return false;
}

async function createBroadcast(filePath) {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !segmentId || !from) {
    console.error("✗ RESEND_API_KEY, RESEND_SEGMENT_ID and RESEND_FROM are required");
    process.exit(1);
  }

  const { data: fm } = matter(fs.readFileSync(filePath, "utf8"));
  if (fm.draft) {
    console.log(`  Skipping ${filePath} (draft)`);
    return;
  }

  const slug = fm.slug || path.basename(filePath, ".mdx");
  const url = `${SITE_URL}/posts/${encodeURIComponent(slug)}`;
  const title = fm.title || slug;

  if (!(await waitUntilLive(url))) {
    console.error(`✗ ${url} never went live; no broadcast created`);
    process.exit(1);
  }

  const send = process.env.RESEND_SEND_NOW === "true";
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      segment_id: segmentId,
      from,
      subject: title,
      name: `New post: ${title}`,
      html: buildHtml({ title, excerpt: fm.excerpt, featuredImage: fm.featuredImage, url }),
      send,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`✗ Resend error ${res.status}: ${data?.message || JSON.stringify(data)}`);
    process.exit(1);
  }

  console.log(
    send
      ? `✓ Broadcast ${data.id} sent for "${title}"`
      : `✓ Draft broadcast ${data.id} created for "${title}" — review and send it at https://resend.com/broadcasts`
  );
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/newsletter-broadcast.js content/posts/<slug>.mdx");
  process.exit(1);
}
createBroadcast(file);
