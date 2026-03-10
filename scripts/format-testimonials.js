#!/usr/bin/env node

/**
 * Adds paragraph breaks to testimonials that are long unformatted text blobs.
 *
 * Heuristics for paragraph breaks:
 * - After questions (sentences ending with ?)
 * - Before common section starters (In my, One thing, I think, Another, During, After)
 * - Every 2-3 sentences for very long blocks
 * - Before "In what ways" type review questions
 *
 * Usage: node scripts/format-testimonials.js [--fix]
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "content", "testimonials.json");
const testimonials = JSON.parse(fs.readFileSync(filePath, "utf8"));

const fix = process.argv.includes("--fix");
let changed = 0;

function formatQuote(quote) {
  // Already has paragraph breaks
  if (quote.includes("\n\n")) return quote;
  // Short enough to not need breaks
  if (quote.length < 400) return quote;

  // Common section-starter patterns that should begin a new paragraph
  const sectionStarters = [
    /(?<=\.\s*)(?=In my )/g,
    /(?<=\.\s*)(?=In what ways)/g,
    /(?<=\.\s*)(?=One thing )/g,
    /(?<=\.\s*)(?=I think )/g,
    /(?<=\.\s*)(?=I have )/g,
    /(?<=\.\s*)(?=I don't think )/g,
    /(?<=\.\s*)(?=I can honestly )/g,
    /(?<=\.\s*)(?=I would )/g,
    /(?<=\.\s*)(?=I'd like )/g,
    /(?<=\.\s*)(?=Another )/g,
    /(?<=\.\s*)(?=After )/g,
    /(?<=\.\s*)(?=During )/g,
    /(?<=\.\s*)(?=However)/g,
    /(?<=\.\s*)(?=Overall)/g,
    /(?<=\.\s*)(?=She (?:is|was|has|does|did|also|even|obviously|continues))/g,
    /(?<=\.\s*)(?=He (?:is|was|has|does|did|also))/g,
    /(?<=\.\s*)(?=Frances (?:is|was|has|does|did|also|continues|even|obviously))/g,
    /(?<=\.\s*)(?=Not only )/g,
    /(?<=\.\s*)(?=Once )/g,
  ];

  let result = quote;

  // Insert paragraph breaks before section starters
  for (const pattern of sectionStarters) {
    result = result.replace(pattern, "\n\n");
  }

  // Also break after questions
  result = result.replace(/(\?\s*)(?=[A-Z])/g, "$1\n\n");

  // If still just one paragraph and very long, split at sentence boundaries every ~3 sentences
  const paragraphs = result.split("\n\n");
  const reformatted = paragraphs.map((para) => {
    if (para.length < 500) return para;

    // Split into sentences
    const sentences = para.match(/[^.!?]+[.!?]+\s*/g) || [para];
    if (sentences.length <= 3) return para;

    // Group into chunks of 2-3 sentences
    const chunks = [];
    let current = "";
    let sentCount = 0;
    for (const s of sentences) {
      current += s;
      sentCount++;
      if (sentCount >= 3 && current.length > 200) {
        chunks.push(current.trim());
        current = "";
        sentCount = 0;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.join("\n\n");
  });

  return reformatted.join("\n\n");
}

for (let i = 0; i < testimonials.length; i++) {
  const t = testimonials[i];
  if (t.quote.length < 400 || t.quote.includes("\n\n")) continue;

  const formatted = formatQuote(t.quote);
  if (formatted !== t.quote) {
    changed++;
    const paraCount = formatted.split("\n\n").length;
    console.log(`${fix ? "FORMATTED" : "WOULD FORMAT"}: ${t.slug} (${t.name})`);
    console.log(`  ${t.quote.length} chars → ${paraCount} paragraphs`);

    if (fix) {
      testimonials[i].quote = formatted;
    }
  }
}

if (fix && changed > 0) {
  fs.writeFileSync(filePath, JSON.stringify(testimonials, null, 2) + "\n");
}

console.log(`\n${fix ? "Formatted" : "Would format"}: ${changed} testimonials`);
if (!fix) {
  console.log("Run with --fix to apply changes");
}
