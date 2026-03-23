#!/usr/bin/env node
/**
 * Generates MDX files in content/posts/ for each project in content/projects.json
 * that doesn't already have a matching blog post file.
 * Run: node scripts/generate-project-mdx.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const PROJECTS_JSON = path.join(ROOT, "content", "projects.json");

const projects = JSON.parse(fs.readFileSync(PROJECTS_JSON, "utf-8"));

if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

const existingSlugs = new Set(
  fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
);

// Safely quote a YAML string value
function yamlStr(value) {
  if (value === null || value === undefined) return "null";
  const s = String(value);
  // Use double-quoted string if it contains special chars
  if (/[:#\[\]{},&*?|<>=!%@`\n'"\\]/.test(s) || s.trim() !== s || s === "") {
    return JSON.stringify(s); // JSON stringify gives valid YAML double-quoted string
  }
  return s;
}

function yamlArray(arr) {
  if (!arr || arr.length === 0) return " []";
  return "\n" + arr.map((item) => `  - ${yamlStr(item)}`).join("\n");
}

let created = 0;
let skipped = 0;

for (const project of projects) {
  if (existingSlugs.has(project.slug)) {
    console.log(`  skip  ${project.slug} (file already exists)`);
    skipped++;
    continue;
  }

  const date = (project.startDate || "2020-01-01").split("T")[0];
  const endDate = project.endDate ? project.endDate.split("T")[0] : null;
  const excerpt = project.description || project.tagline || "";
  const organizations = project.organization ? [project.organization] : [];

  const lines = [
    "---",
    `title: ${yamlStr(project.title)}`,
    `slug: ${project.slug}`,
    `date: "${date}"`,
    `excerpt: ${yamlStr(excerpt)}`,
    `featuredImage: ${yamlStr(project.logo || "")}`,
    `type: project`,
    `tagline: ${yamlStr(project.tagline || "")}`,
    `projectUrl: ${yamlStr(project.url || "")}`,
    `projectCategory: ${project.category}`,
    `startDate: "${date}"`,
    endDate ? `endDate: "${endDate}"` : `endDate: null`,
    project.status ? `status: ${project.status}` : null,
    project.github ? `github: ${yamlStr(project.github)}` : null,
    project.organization ? `organization: ${project.organization}` : null,
    project.logo ? `logo: ${yamlStr(project.logo)}` : null,
    project.emoji ? `emoji: ${yamlStr(project.emoji)}` : null,
    `highlights:${yamlArray(project.highlights || [])}`,
    `skills:${yamlArray(project.skills || [])}`,
    `organizations:${yamlArray(organizations)}`,
    `categories:${yamlArray(["portfolio"])}`,
    `tags:${yamlArray(project.skills || [])}`,
    "---",
    "",
  ].filter((line) => line !== null);

  const content = lines.join("\n");
  const filePath = path.join(POSTS_DIR, `${project.slug}.mdx`);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`  create ${project.slug}.mdx`);
  created++;
}

console.log(`\nDone: ${created} created, ${skipped} skipped`);
