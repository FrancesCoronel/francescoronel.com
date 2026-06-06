#!/usr/bin/env node
// Posts a daily "top of mind" digest to Slack by pulling from GitHub + Linear,
// then asking Claude to synthesize it into a concise briefing.

const Anthropic = require("@anthropic-ai/sdk").default;

const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const GH_TOKEN = process.env.GH_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "francescoronel/francescoronel.com";

async function fetchGitHubData() {
  const headers = {
    Authorization: `Bearer ${GH_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const [owner, repo] = GITHUB_REPOSITORY.split("/");

  const [prsRes, issuesRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=20`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=20`, { headers }),
  ]);

  const prs = prsRes.ok ? await prsRes.json() : [];
  const issues = issuesRes.ok ? await issuesRes.json() : [];
  const realIssues = issues.filter((i) => !i.pull_request);

  return { prs, issues: realIssues };
}

async function fetchLinearData() {
  if (!LINEAR_API_KEY) return { issues: [] };

  const query = `{
    viewer {
      assignedIssues(filter: { state: { type: { nin: ["completed", "cancelled"] } } }, first: 20, orderBy: updatedAt) {
        nodes {
          identifier
          title
          priority
          state { name }
          updatedAt
          url
        }
      }
    }
  }`;

  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      Authorization: LINEAR_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) return { issues: [] };
  const data = await res.json();
  return { issues: data.data?.viewer?.assignedIssues?.nodes || [] };
}

async function synthesizeWithClaude(github, linear) {
  const anthropic = new Anthropic();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const context = `
Today is ${today}.

GITHUB — Open PRs (${github.prs.length}):
${github.prs.map((pr) => `- [#${pr.number}] ${pr.title} (${pr.user.login}, ${pr.draft ? "draft" : "ready"})`).join("\n") || "None"}

GITHUB — Open Issues (${github.issues.length}):
${github.issues.map((i) => `- [#${i.number}] ${i.title}`).join("\n") || "None"}

LINEAR — My Issues (${linear.issues.length}):
${
  linear.issues
    .map((i) => {
      const priority = ["", "🔴 Urgent", "🟠 High", "🟡 Medium", "🔵 Low"][i.priority] || "";
      return `- [${i.identifier}] ${i.title} — ${i.state.name} ${priority}`;
    })
    .join("\n") || "None"
}
  `.trim();

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `You are a concise executive assistant. Based on the data below, write a brief daily digest for Francesco — a Latina software engineer / developer advocate.

Format it as a short Slack message with 3 sections:
1. 🔥 *Top priorities today* (max 3 bullet points, the most urgent things)
2. 📋 *On the radar* (2-3 notable items worth knowing but not urgent)
3. 💡 *One suggestion* (one concrete thing Francesco could do today to move things forward)

Keep it under 200 words. Be direct and specific. No fluff.

${context}`,
      },
    ],
  });

  return message.content[0].text;
}

async function postToSlack(text) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: SLACK_CHANNEL_ID,
      text: `*Good morning! Here's your daily digest for ${today}* ☀️\n\n${text}`,
      unfurl_links: false,
    }),
  });

  const data = await res.json();
  if (!data.ok) throw new Error(`Slack error: ${data.error}`);
  console.log("✅ Posted to Slack:", data.ts);
}

async function main() {
  console.log("Fetching data...");
  const [github, linear] = await Promise.all([fetchGitHubData(), fetchLinearData()]);

  console.log(`GitHub: ${github.prs.length} PRs, ${github.issues.length} issues`);
  console.log(`Linear: ${linear.issues.length} issues`);

  console.log("Synthesizing with Claude...");
  const summary = await synthesizeWithClaude(github, linear);

  console.log("Posting to Slack...");
  await postToSlack(summary);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
