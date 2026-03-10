#!/usr/bin/env node

/**
 * Validates organization assignments across all blog posts.
 * Removes orgs that aren't actually mentioned in the post content
 * (title, excerpt, or body text).
 *
 * Pass --dry-run to preview changes without writing.
 * Pass --fix to apply changes.
 */

const fs = require("fs");
const path = require("path");

const dryRun = !process.argv.includes("--fix");

const BLOG_DIR = path.join(__dirname, "..", "content", "blog");
const orgs = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "content", "organizations.json"),
    "utf-8"
  )
);
const exps = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "content", "experience.json"),
    "utf-8"
  )
);

// Build org slug → search keywords mapping
const orgKeywords = {};
for (const org of orgs) {
  const keywords = [org.name.toLowerCase()];

  // Add common aliases
  const aliases = {
    slack: ["slack"],
    accenture: ["accenture", "fdm"],
    "fullstack-academy": ["fullstack academy", "fullstack", "gracehopper", "grace hopper"],
    "cornell-tech": ["cornell tech", "cornell"],
    "stanford-university": ["stanford"],
    "hampton-university": ["hampton university", "hampton"],
    techqueria: ["techqueria", "latinx in tech"],
    "girls-who-code": ["girls who code", "gwc"],
    udacity: ["udacity"],
    github: ["github"],
    "women-who-code": ["women who code", "wwcode"],
    codenewbie: ["codenewbie", "code newbie"],
    byteboard: ["byteboard"],
    jupiterone: ["jupiterone", "jupiter one"],
    formation: ["formation"],
    dreamforce: ["dreamforce"],
    sabio: ["sabio"],
    "goldman-sachs": ["goldman sachs", "goldman"],
    asana: ["asana"],
    pluralsight: ["pluralsight"],
    doximity: ["doximity"],
    ripple: ["ripple"],
    sourcegraph: ["sourcegraph"],
    "old-dominion-university": ["old dominion", "odu"],
    "tidewater-community-college": ["tidewater", "tcc"],
    "jacobs-university-bremen": ["jacobs university", "jacobs uni"],
    "ltx-fest": ["ltx fest", "ltx"],
    smash: ["smash academy", "smash"],
    alterconf: ["alterconf"],
    "course-report": ["course report"],
    elpha: ["elpha"],
    builtin: ["builtin", "built in"],
    brighttalk: ["brighttalk"],
    belatina: ["belatina"],
    betterup: ["betterup"],
    "integral-ad-science": ["integral ad science"],
    "project-alloy": ["project alloy", "alloy"],
    "unidos-us": ["unidosus", "unidos us", "unidos"],
    "aspen-institute": ["aspen institute", "aspen"],
    "aspen-institute-latinos-and-society-program-ailas": [
      "aspen institute latinos",
      "ailas",
      "ricardo salinas",
    ],
    "association-of-computing-machinery": ["acm", "association of computing machinery"],
    gobeyondresumes: ["gobeyondresumes", "go beyond resumes"],
    somos: ["somos"],
    outco: ["outco"],
    "coro-northern-california": ["coro"],
    "code2040": ["code2040", "code 2040"],
    "tapia-conference": ["tapia"],
  };

  if (aliases[org.slug]) {
    keywords.push(...aliases[org.slug]);
  }

  orgKeywords[org.slug] = [...new Set(keywords)];
}

function isOrgMentioned(orgSlug, text) {
  const keywords = orgKeywords[orgSlug];
  if (!keywords) return false;

  const lower = text.toLowerCase();

  for (const kw of keywords) {
    if (kw.length < 4) continue;
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lower)) return true;
  }

  return false;
}

// Process all posts
const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
let totalChecked = 0;
let totalModified = 0;
let totalOrgsRemoved = 0;
const removals = [];

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, "utf-8");

  // Extract frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;

  const fm = fmMatch[1];
  const orgLine = fm.match(/^organizations:\s*(.*)$/m);
  if (!orgLine) continue;

  // Parse org array
  const orgVal = orgLine[1].trim();
  let currentOrgs;
  try {
    currentOrgs = JSON.parse(orgVal);
  } catch {
    continue;
  }

  if (!Array.isArray(currentOrgs) || currentOrgs.length === 0) continue;

  totalChecked++;

  // Get post content for matching
  const titleMatch = fm.match(/^title:\s*"?(.*?)"?\s*$/m);
  const excerptMatch = fm.match(/^excerpt:\s*"?(.*?)"?\s*$/m);
  const title = titleMatch ? titleMatch[1] : "";
  const excerpt = excerptMatch ? excerptMatch[1] : "";
  const body = content.slice(fmMatch[0].length);
  const fullText = `${title} ${excerpt} ${body}`;

  // Validate each org
  const validOrgs = [];
  const removedOrgs = [];

  for (const orgSlug of currentOrgs) {
    if (isOrgMentioned(orgSlug, fullText)) {
      validOrgs.push(orgSlug);
    } else {
      removedOrgs.push(orgSlug);
    }
  }

  if (removedOrgs.length > 0) {
    totalModified++;
    totalOrgsRemoved += removedOrgs.length;
    removals.push({
      file,
      title,
      removed: removedOrgs,
      kept: validOrgs,
    });

    if (!dryRun) {
      const orgArrayStr =
        validOrgs.length === 0
          ? "[]"
          : validOrgs.length === 1
          ? `["${validOrgs[0]}"]`
          : `[${validOrgs.map((o) => `"${o}"`).join(", ")}]`;

      const newContent = content.replace(
        /^organizations:\s*.*$/m,
        `organizations: ${orgArrayStr}`
      );
      fs.writeFileSync(filePath, newContent, "utf-8");
    }
  }
}

console.log(`\n${dryRun ? "DRY RUN — no changes written" : "CHANGES APPLIED"}`);
console.log(`\nResults:`);
console.log(`  Posts checked: ${totalChecked}`);
console.log(`  Posts modified: ${totalModified}`);
console.log(`  Total orgs removed: ${totalOrgsRemoved}`);

if (removals.length > 0) {
  console.log(`\nDetails:`);
  for (const r of removals) {
    console.log(`\n  ${r.file}`);
    console.log(`    Title: ${r.title}`);
    console.log(`    Removed: ${r.removed.join(", ")}`);
    console.log(`    Kept: ${r.kept.length > 0 ? r.kept.join(", ") : "(none)"}`);
  }
}

if (dryRun) {
  console.log(`\nRun with --fix to apply changes.`);
}
