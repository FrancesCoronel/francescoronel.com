#!/usr/bin/env node
// When a new blog post is published, drafts a LinkedIn post and sends it to
// Slack for review before manually posting.

const Anthropic = require("@anthropic-ai/sdk").default;
const fs = require("fs");
const path = require("path");

const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

const mdxFile = process.argv[2];
if (!mdxFile) {
  console.error("Usage: node scripts/draft-linkedin.js <path-to-mdx>");
  process.exit(1);
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line
      .slice(colonIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    fm[key] = value;
  }
  return fm;
}

function extractBody(content) {
  return content
    .replace(/^---[\s\S]*?---\n/, "")
    .trim()
    .slice(0, 2000);
}

async function draftLinkedIn(frontmatter, body, filePath) {
  const anthropic = new Anthropic();
  const slug = path.basename(filePath, ".mdx");
  const postUrl = `https://www.francescoronel.com/blog/${slug}`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are helping Francesco Coronel (she/her) draft a LinkedIn post for her new blog article.

Article details:
- Title: ${frontmatter.title || slug}
- Excerpt: ${frontmatter.excerpt || ""}
- Categories: ${frontmatter.categories || ""}
- URL: ${postUrl}

Opening of the article:
${body}

Write a LinkedIn post draft that:
1. Starts with a hook (not "I just published" — be more creative and specific)
2. Shares the key insight or takeaway from the article in 2-3 sentences
3. Ends with a call to action + the link
4. Uses 2-4 relevant hashtags at the end
5. Feels authentic to a Latina software engineer / developer advocate who is thoughtful and direct
6. Is 150-250 words max

Output ONLY the LinkedIn post text, nothing else.`,
      },
    ],
  });

  return {
    draft: message.content[0].text,
    postUrl,
    title: frontmatter.title || slug,
  };
}

async function postToSlack(title, postUrl, draft) {
  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: SLACK_CHANNEL_ID,
      text: `📝 New post published: ${title} — LinkedIn draft ready for review`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `📝 *New post published!*\n*<${postUrl}|${title}>*`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*LinkedIn draft — copy, tweak, and post:*\n\`\`\`${draft}\`\`\``,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "Post on LinkedIn" },
              url: "https://www.linkedin.com/post/new",
            },
            {
              type: "button",
              text: { type: "plain_text", text: "Read the post" },
              url: postUrl,
            },
          ],
        },
      ],
    }),
  });

  const data = await res.json();
  if (!data.ok) throw new Error(`Slack error: ${data.error}`);
  console.log("✅ LinkedIn draft posted to Slack:", data.ts);
}

async function main() {
  const content = fs.readFileSync(mdxFile, "utf8");
  const frontmatter = parseFrontmatter(content);
  const body = extractBody(content);

  console.log(`Drafting LinkedIn post for: ${frontmatter.title || mdxFile}`);
  const { draft, postUrl, title } = await draftLinkedIn(frontmatter, body, mdxFile);

  console.log("Posting draft to Slack...");
  await postToSlack(title, postUrl, draft);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
