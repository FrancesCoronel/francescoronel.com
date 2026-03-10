#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "content", "blog");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

let promoted = 0;

for (const f of files) {
  const filePath = path.join(dir, f);
  const content = fs.readFileSync(filePath, "utf8");
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;

  const imgMatch = fm[1].match(/^featuredImage:\s*"(.*?)"/m);
  const img = imgMatch ? imgMatch[1].trim() : "";

  if (img) continue; // already has a real featured image

  // Find first image in body
  const body = content.slice(fm[0].length);
  const bodyImgMatch = body.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
  if (!bodyImgMatch) continue;

  const imageUrl = bodyImgMatch[1];

  let updatedContent;
  if (imgMatch) {
    // Replace existing empty featuredImage
    updatedContent = content.replace(
      /^(featuredImage:\s*)""/m,
      `$1"${imageUrl}"`
    );
  } else {
    // Add featuredImage to frontmatter
    const frontmatter = fm[1];
    const updatedFrontmatter = frontmatter + `\nfeaturedImage: "${imageUrl}"`;
    updatedContent = content.replace(
      `---\n${frontmatter}\n---`,
      `---\n${updatedFrontmatter}\n---`
    );
  }

  if (process.argv.includes("--fix")) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`PROMOTED: ${f}`);
    console.log(`  Image: ${imageUrl}`);
  } else {
    console.log(`WOULD PROMOTE: ${f}`);
    console.log(`  Image: ${imageUrl}`);
  }
  promoted++;
}

console.log(`\n${process.argv.includes("--fix") ? "Promoted" : "Would promote"}: ${promoted} posts`);
if (!process.argv.includes("--fix")) {
  console.log("Run with --fix to apply changes");
}
