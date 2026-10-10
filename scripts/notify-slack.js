#!/usr/bin/env node
/**
 * Post a Slack reminder with the manual sharing steps for a new blog post.
 *
 * Usage:
 *   node scripts/notify-slack.js content/posts/my-post.mdx [--dry-run]
 *
 * Required env vars:
 *   SLACK_WEBHOOK_URL — Slack incoming webhook (api.slack.com/messaging/webhooks)
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = "https://www.francescoronel.com";

function buildMessage(filePath) {
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  const slug = data.slug || path.basename(filePath, path.extname(filePath));
  const url = `${SITE_URL}/posts/${slug}`;
  return [
    `📣 *New post is live:* <${url}|${data.title || slug}>`,
    "",
    "Your manual sharing steps:",
    "• Review and schedule the Buffer drafts (LinkedIn, Bluesky, Threads): https://publish.buffer.com",
    "• If it's a flagship essay, republish it as a LinkedIn Newsletter issue",
    "• Share it on Reddit in a relevant subreddit, in your own words",
  ].join("\n");
}

async function notify(filePath, { dryRun }) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
  const text = buildMessage(filePath);
  if (dryRun) {
    console.log(text);
    return;
  }

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.error("Error: SLACK_WEBHOOK_URL environment variable is not set.");
    process.exit(1);
  }
  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    console.error(`Slack ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  console.log("✓ Slack reminder sent");
}

const args = process.argv.slice(2);
const filePath = args.find((a) => !a.startsWith("--"));
if (!filePath) {
  console.error("Usage: node scripts/notify-slack.js <path-to-post.mdx> [--dry-run]");
  process.exit(1);
}

notify(filePath, { dryRun: args.includes("--dry-run") }).catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
