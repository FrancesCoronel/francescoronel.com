#!/usr/bin/env node
/**
 * Fix markdown semantic heading issues across all MDX posts.
 *
 * Fixes (applied in order):
 *   1. MD003  — setext headings (underline style) → ATX (## style)
 *   2. MD025  — duplicate h1s after the first → h2
 *   3. Paragraphs masquerading as headings → plain text
 *              Heuristic: heading text > 80 chars, OR > 40 chars ending with "."
 *   4. MD001  — heading levels never jump more than one step
 *              and the first heading in the body starts at h2
 *
 * Frontmatter and fenced code blocks are never modified.
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const POSTS_DIR = "./content/posts";

// ─── Code-block-safe transformer ─────────────────────────────────────────────
// Splits content at fenced code block boundaries, applies `fn` only to
// non-code chunks, then reassembles — preserving the original byte content
// of every code block exactly.

function transformOutsideCode(content, fn) {
  // Split keeping the code blocks as captured groups
  const parts = content.split(/(^```[\s\S]*?^```[ \t]*$)/m);
  return parts
    .map((part, i) => (i % 2 === 1 ? part : fn(part))) // odd indices = code blocks
    .join("");
}

// ─── Fix 0: Pre-clean ────────────────────────────────────────────────────────
// Remove empty heading lines (e.g. "### " with no text — Webflow artifacts).
// Escape bare social-media hashtags at line start (#Hashtag → \#Hashtag) so
// they are not misidentified as ATX headings by markdownlint.

function preclean(content) {
  return transformOutsideCode(content, (text) =>
    text
      // Remove lines that are only hashes + optional whitespace (empty headings)
      .replace(/^#{1,6}\s*$/gm, "")
      // Escape #Word (no space) at line start → social media hashtag, not a heading
      .replace(/^(#{1,6})([A-Za-z])/gm, "\\$1$2")
  );
}

// ─── Fix 1: MD003 — setext → ATX ─────────────────────────────────────────────

function fixSetextHeadings(content) {
  return transformOutsideCode(content, (text) =>
    text
      .replace(/^([^\n#>|` \t].+)\n={2,}[ \t]*$/gm, "# $1")   // h1 setext (1+ =)
      .replace(/^([^\n#>|` \t\-].+)\n-{2,}[ \t]*$/gm, "## $1") // h2 setext (1+ -)
  );
}

// ─── Fix 2: MD025 — only one h1 allowed ──────────────────────────────────────

function fixMultipleH1(content) {
  // All posts have `title:` in frontmatter which markdownlint treats as the h1.
  // Any # heading in the body is therefore always a duplicate — convert them all to h2.
  return transformOutsideCode(content, (text) =>
    text.replace(/^# (.+)$/gm, (_, body) => `## ${body}`)
  );
}

// ─── Fix 3: Paragraph-headings → plain text ──────────────────────────────────
// A heading is really a paragraph if its text is:
//   • longer than 80 chars, OR
//   • longer than 40 chars AND ends with "."
// These patterns match Webflow's habit of styling body text as Heading elements.

function isParagraphHeading(text) {
  return text.length > 80 || (text.length > 40 && text.endsWith("."));
}

function fixParagraphHeadings(content) {
  return transformOutsideCode(content, (text) =>
    text.replace(/^(#{1,6}) (.+)$/gm, (match, hashes, body) =>
      isParagraphHeading(body) ? body : match
    )
  );
}

// ─── Fix 4: MD001 — normalize heading hierarchy ───────────────────────────────
// Two passes:
//   a) Global upward shift: if shallowest heading is > h2, promote all up so
//      the shallowest becomes h2.
//   b) Sequential clamp: scan headings in document order; a heading may only
//      go one level deeper than the previous (going shallower is always fine).
//      Implicit starting level is h1 (the post title lives in frontmatter).

function fixHeadingLevels(content) {
  // Collect all heading levels outside code blocks
  const levels = [];
  transformOutsideCode(content, (text) => {
    for (const m of text.matchAll(/^(#{1,6}) /gm)) levels.push(m[1].length);
    return text;
  });
  if (levels.length === 0) return content;

  // Pass a: global shift
  const minLevel = Math.min(...levels);
  const shift = minLevel > 2 ? minLevel - 2 : 0;
  let out = shift === 0
    ? content
    : transformOutsideCode(content, (text) =>
        text.replace(/^(#{1,6}) /gm, (_, h) =>
          "#".repeat(Math.max(2, h.length - shift)) + " "
        )
      );

  // Pass b: sequential clamp
  let prev = 1; // implicit h1 from frontmatter title
  out = transformOutsideCode(out, (text) =>
    text.replace(/^(#{1,6}) (.+)$/gm, (_, h, body) => {
      const level = h.length;
      const clamped = level > prev + 1 ? prev + 1 : level;
      prev = clamped;
      return "#".repeat(clamped) + " " + body;
    })
  );

  return out;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function processFile(filePath) {
  const raw = readFileSync(filePath, "utf-8");
  const fmMatch = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!fmMatch) return false;

  const [, frontmatter, body] = fmMatch;
  let fixed = body;
  fixed = preclean(fixed);
  fixed = fixSetextHeadings(fixed);
  fixed = fixMultipleH1(fixed);
  fixed = fixParagraphHeadings(fixed);
  fixed = fixHeadingLevels(fixed);

  if (fixed === body) return false;
  writeFileSync(filePath, frontmatter + fixed);
  return true;
}

const files = readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => join(POSTS_DIR, f));

let changed = 0;
for (const file of files) {
  if (processFile(file)) changed++;
}
console.log(`Processed ${files.length} files — fixed ${changed}.`);
