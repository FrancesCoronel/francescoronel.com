#!/usr/bin/env node

/**
 * Analyzes recent blog posts and suggests updates to static pages
 * (mentoring, speaking, uses, about) based on new content.
 *
 * Run: node scripts/suggest-page-updates.js [--days 30]
 *
 * Outputs a markdown report of suggested updates.
 * Used by the GitHub Action to create PRs with suggestions.
 */

const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(__dirname, "..", "content", "blog");
const days = parseInt(process.argv.find((_, i, a) => a[i - 1] === "--days") || "90");
const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - days);

// Load all recent posts
const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
const recentPosts = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;

  const fm = fmMatch[1];
  const dateMatch = fm.match(/^date:\s*"?(.*?)"?\s*$/m);
  const titleMatch = fm.match(/^title:\s*"?(.*?)"?\s*$/m);
  const categoriesMatch = fm.match(/^categories:\s*\[(.*?)\]/m);
  const tagsMatch = fm.match(/^tags:\s*\[(.*?)\]/m);
  const orgsMatch = fm.match(/^organizations:\s*\[(.*?)\]/m);

  const date = dateMatch ? dateMatch[1] : "";
  if (!date || new Date(date) < cutoff) continue;

  recentPosts.push({
    file,
    title: titleMatch ? titleMatch[1] : file,
    date,
    categories: categoriesMatch
      ? categoriesMatch[1].replace(/"/g, "").split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    tags: tagsMatch
      ? tagsMatch[1].replace(/"/g, "").split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    orgs: orgsMatch
      ? orgsMatch[1].replace(/"/g, "").split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    body: content.slice(fmMatch[0].length).toLowerCase(),
  });
}

// Analyze patterns
const topicCounts = {};
const orgCounts = {};
const categoryCounts = {};

for (const post of recentPosts) {
  for (const tag of post.tags) {
    topicCounts[tag] = (topicCounts[tag] || 0) + 1;
  }
  for (const org of post.orgs) {
    orgCounts[org] = (orgCounts[org] || 0) + 1;
  }
  for (const cat of post.categories) {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
}

// Detect skill areas from content
const skillKeywords = {
  "AI Agents": ["ai agent", "mcp server", "claude", "llm", "ai-powered"],
  "DevXP": ["developer experience", "devxp", "dx", "developer tooling"],
  "Open Source": ["open source", "oss", "contribution", "maintainer"],
  "TypeScript": ["typescript", "ts", "type-safe"],
  "React": ["react", "next.js", "nextjs", "component"],
  "Accessibility": ["a11y", "accessibility", "wcag", "aria"],
  "Performance": ["lighthouse", "performance", "web vitals", "core web vitals"],
  "Growth Engineering": ["growth", "experiment", "a/b test", "conversion"],
  "Engineering Management": ["management", "leadership", "mentoring", "1:1"],
};

const detectedSkills = {};
for (const post of recentPosts) {
  const text = `${post.title} ${post.body}`;
  for (const [skill, keywords] of Object.entries(skillKeywords)) {
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) {
        detectedSkills[skill] = (detectedSkills[skill] || 0) + 1;
        break;
      }
    }
  }
}

// Speaking posts
const speakingPosts = recentPosts.filter((p) => p.categories.includes("speaking"));

// Generate report
const lines = [];
lines.push(`# Page Update Suggestions`);
lines.push(`Based on ${recentPosts.length} blog posts from the last ${days} days.\n`);

if (Object.keys(detectedSkills).length > 0) {
  lines.push(`## Mentoring Page — Expertise Areas`);
  lines.push(`Consider updating expertise areas with these topics from recent posts:\n`);
  const sorted = Object.entries(detectedSkills).sort((a, b) => b[1] - a[1]);
  for (const [skill, count] of sorted) {
    lines.push(`- **${skill}** (mentioned in ${count} post${count > 1 ? "s" : ""})`);
  }
  lines.push("");
}

if (speakingPosts.length > 0) {
  lines.push(`## Speaking Page — New Talks`);
  lines.push(`${speakingPosts.length} new speaking post${speakingPosts.length > 1 ? "s" : ""} detected:\n`);
  for (const post of speakingPosts) {
    lines.push(`- **${post.title}** (${post.date})`);
  }
  lines.push("");
}

const topOrgs = Object.entries(orgCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
if (topOrgs.length > 0) {
  lines.push(`## About Page — Active Organizations`);
  lines.push(`Most referenced orgs in recent posts:\n`);
  for (const [org, count] of topOrgs) {
    lines.push(`- **${org}** (${count} post${count > 1 ? "s" : ""})`);
  }
  lines.push("");
}

const topTopics = Object.entries(topicCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);
if (topTopics.length > 0) {
  lines.push(`## Uses/Blog — Trending Topics`);
  lines.push(`Most common tags:\n`);
  for (const [topic, count] of topTopics) {
    lines.push(`- **${topic}** (${count})`);
  }
  lines.push("");
}

if (recentPosts.length === 0) {
  lines.push(`No new posts found in the last ${days} days. No updates suggested.`);
}

const report = lines.join("\n");
console.log(report);

// Write report to file for GitHub Action
const outputPath = path.join(__dirname, "..", "page-update-suggestions.md");
fs.writeFileSync(outputPath, report, "utf-8");
console.error(`\nReport written to: ${outputPath}`);
