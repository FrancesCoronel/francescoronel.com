#!/usr/bin/env node

/**
 * Assigns organizations to blog posts based on:
 * 1. Keyword matching (org name mentioned in title, excerpt, or body)
 * 2. Category-based matching (e.g., "speaking" category → conference orgs mentioned)
 * 3. Date-based fallback (which employer Frances was at when the post was written)
 *
 * Only modifies posts that have organizations: [] (empty).
 * Writes changes in-place to MDX frontmatter.
 */

const fs = require("fs");
const path = require("path");

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
const edus = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "content", "education.json"),
    "utf-8"
  )
);

// Build keyword → org slug mapping
// Use org names and common aliases
const keywordMap = {};
for (const org of orgs) {
  const keywords = [org.name.toLowerCase()];

  // Add common aliases/abbreviations
  if (org.slug === "slack") keywords.push("slack");
  if (org.slug === "accenture") keywords.push("accenture", "fdm");
  if (org.slug === "fullstack-academy")
    keywords.push("fullstack academy", "fullstack", "gracehopper");
  if (org.slug === "cornell-tech") keywords.push("cornell tech", "cornell");
  if (org.slug === "stanford-university")
    keywords.push("stanford");
  if (org.slug === "hampton-university")
    keywords.push("hampton university", "hampton");
  if (org.slug === "techqueria")
    keywords.push("techqueria", "latinx in tech");
  if (org.slug === "girls-who-code") keywords.push("girls who code", "gwc");
  if (org.slug === "udacity") keywords.push("udacity");
  if (org.slug === "github") keywords.push("github");
  if (org.slug === "women-who-code") keywords.push("women who code", "wwcode");
  if (org.slug === "codenewbie") keywords.push("codenewbie", "code newbie");
  if (org.slug === "byteboard") keywords.push("byteboard");
  if (org.slug === "jupiterone") keywords.push("jupiterone", "jupiter one");
  if (org.slug === "formation") keywords.push("formation");
  if (org.slug === "dreamforce") keywords.push("dreamforce");
  if (org.slug === "sabio") keywords.push("sabio");
  if (org.slug === "goldman-sachs") keywords.push("goldman sachs", "goldman");
  if (org.slug === "asana") keywords.push("asana");
  if (org.slug === "pluralsight") keywords.push("pluralsight");
  if (org.slug === "doximity") keywords.push("doximity");
  if (org.slug === "ripple") keywords.push("ripple");
  if (org.slug === "sourcegraph") keywords.push("sourcegraph");
  if (org.slug === "old-dominion-university")
    keywords.push("old dominion", "odu");
  if (org.slug === "tidewater-community-college")
    keywords.push("tidewater", "tcc");
  if (org.slug === "jacobs-university-bremen")
    keywords.push("jacobs university", "jacobs uni");
  if (org.slug === "ltx-fest") keywords.push("ltx fest", "ltx");
  if (org.slug === "smash") keywords.push("smash academy", "smash");
  if (org.slug === "alterconf") keywords.push("alterconf");
  if (org.slug === "course-report") keywords.push("course report");
  if (org.slug === "elpha") keywords.push("elpha");
  if (org.slug === "builtin") keywords.push("builtin", "built in");
  if (org.slug === "brighttalk") keywords.push("brighttalk");
  if (org.slug === "belatina") keywords.push("belatina");
  if (org.slug === "betterup") keywords.push("betterup");
  if (org.slug === "integral-ad-science") keywords.push("integral ad science");
  if (org.slug === "project-alloy") keywords.push("project alloy", "alloy");

  for (const kw of keywords) {
    if (!keywordMap[kw]) keywordMap[kw] = [];
    if (!keywordMap[kw].includes(org.slug)) keywordMap[kw].push(org.slug);
  }
}

// Build employer timeline (sorted by start date, most recent first)
// Only include primary employers (not mentoring/volunteer)
const employerTimeline = exps
  .filter((e) => {
    const t = e.title.toLowerCase();
    return !t.includes("mentor") && !t.includes("volunteer") && !t.includes("interviewer");
  })
  .map((e) => {
    const orgMatch = orgs.find(
      (o) => o.name.toLowerCase() === e.company.toLowerCase()
    );
    return {
      slug: orgMatch ? orgMatch.slug : e.company.toLowerCase().replace(/\s+/g, "-"),
      start: new Date(e.startDate),
      end: e.endDate ? new Date(e.endDate) : new Date(),
    };
  })
  .sort((a, b) => b.start - a.start);

// Education timeline
const eduTimeline = edus
  .map((e) => {
    const orgMatch = orgs.find(
      (o) => o.name.toLowerCase() === e.institution.toLowerCase()
    );
    return {
      slug: orgMatch ? orgMatch.slug : e.institution.toLowerCase().replace(/\s+/g, "-"),
      start: new Date(e.startDate),
      end: new Date(e.endDate),
    };
  })
  .sort((a, b) => b.start - a.start);

function findEmployerByDate(dateStr) {
  const d = new Date(dateStr);
  for (const emp of employerTimeline) {
    if (d >= emp.start && d <= emp.end) {
      // Only return if org exists in our orgs list
      if (orgs.some((o) => o.slug === emp.slug)) {
        return emp.slug;
      }
    }
  }
  return null;
}

function findEduByDate(dateStr) {
  const d = new Date(dateStr);
  for (const edu of eduTimeline) {
    if (d >= edu.start && d <= edu.end) {
      if (orgs.some((o) => o.slug === edu.slug)) {
        return edu.slug;
      }
    }
  }
  return null;
}

function findOrgsByKeyword(text) {
  const lower = text.toLowerCase();
  const found = new Set();

  // Sort keywords by length (longest first) to avoid partial matches
  const sortedKeywords = Object.keys(keywordMap).sort(
    (a, b) => b.length - a.length
  );

  for (const kw of sortedKeywords) {
    // Skip very short keywords that could cause false positives
    if (kw.length < 4) continue;

    // Word boundary matching
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(lower)) {
      for (const slug of keywordMap[kw]) {
        found.add(slug);
      }
    }
  }

  return [...found];
}

// Process all posts
const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
let updated = 0;
let skipped = 0;
let alreadyHas = 0;
const stats = {};

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, "utf-8");

  // Check if already has orgs
  const orgLine = content.match(/^organizations:\s*(.*)$/m);
  if (orgLine) {
    const val = orgLine[1].trim();
    if (val !== "[]" && val !== "" && val !== '[""]') {
      alreadyHas++;
      continue;
    }
  }

  // Extract frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    skipped++;
    continue;
  }

  const fm = fmMatch[1];
  const titleMatch = fm.match(/^title:\s*"?(.*?)"?\s*$/m);
  const excerptMatch = fm.match(/^excerpt:\s*"?(.*?)"?\s*$/m);
  const dateMatch = fm.match(/^date:\s*"?(.*?)"?\s*$/m);

  const title = titleMatch ? titleMatch[1] : "";
  const excerpt = excerptMatch ? excerptMatch[1] : "";
  const date = dateMatch ? dateMatch[1] : "";

  // Get body text (after frontmatter)
  const body = content.slice(fmMatch[0].length);

  // 1. Keyword matching on title + excerpt + body
  const searchText = `${title} ${excerpt} ${body}`;
  const keywordOrgs = findOrgsByKeyword(searchText);

  // 2. Date-based employer fallback
  const employerOrg = date ? findEmployerByDate(date) : null;
  const eduOrg = date ? findEduByDate(date) : null;

  // Combine: keyword matches first, then employer, then education
  const allOrgs = [...new Set([
    ...keywordOrgs,
    ...(employerOrg ? [employerOrg] : []),
    ...(eduOrg ? [eduOrg] : []),
  ])];

  if (allOrgs.length === 0) {
    skipped++;
    continue;
  }

  // Format the organizations array
  const orgArrayStr =
    allOrgs.length === 1
      ? `["${allOrgs[0]}"]`
      : `[${allOrgs.map((o) => `"${o}"`).join(", ")}]`;

  // Replace in content
  const newContent = content.replace(
    /^organizations:\s*.*$/m,
    `organizations: ${orgArrayStr}`
  );

  fs.writeFileSync(filePath, newContent, "utf-8");
  updated++;

  for (const o of allOrgs) {
    stats[o] = (stats[o] || 0) + 1;
  }
}

console.log(`\nResults:`);
console.log(`  Already had orgs: ${alreadyHas}`);
console.log(`  Updated: ${updated}`);
console.log(`  No match (skipped): ${skipped}`);
console.log(`  Total: ${files.length}`);
console.log(`\nOrg assignment counts:`);
const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
for (const [org, count] of sorted) {
  console.log(`  ${org}: ${count}`);
}
