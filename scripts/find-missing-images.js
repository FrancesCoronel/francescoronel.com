#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "content", "blog");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

let noImage = 0;
let hasImage = 0;
const missing = [];
const bodyImages = [];

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), "utf8");
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;

  const imgMatch = fm[1].match(/^featuredImage:\s*"(.*?)"/m);
  const titleMatch = fm[1].match(/^title:\s*"(.*?)"/m);
  const dateMatch = fm[1].match(/^date:\s*"(.*?)"/m);
  const catMatch = fm[1].match(/^categories:\s*\[(.*?)\]/m);
  const sourceMatch = fm[1].match(/^source:\s*"(.*?)"/m);
  const img = imgMatch ? imgMatch[1].trim() : "";

  if (!img) {
    noImage++;

    // Check if the body has any images we could use
    const body = content.slice(fm[0].length);
    const bodyImgMatches = body.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/g) || [];
    const imgUrls = bodyImgMatches.map((m) => {
      const urlMatch = m.match(/\((https?:\/\/[^)]+)\)/);
      return urlMatch ? urlMatch[1] : "";
    }).filter(Boolean);

    missing.push({
      file: f.replace(".mdx", ""),
      title: titleMatch ? titleMatch[1] : f,
      date: dateMatch ? dateMatch[1].substring(0, 10) : "",
      cats: catMatch ? catMatch[1].replace(/"/g, "").trim() : "",
      source: sourceMatch ? sourceMatch[1] : "",
      bodyImageCount: imgUrls.length,
      firstBodyImage: imgUrls[0] || "",
    });

    if (imgUrls.length > 0) {
      bodyImages.push({
        file: f.replace(".mdx", ""),
        title: titleMatch ? titleMatch[1] : f,
        imageUrl: imgUrls[0],
        totalImages: imgUrls.length,
      });
    }
  } else {
    hasImage++;
  }
}

console.log(`Has image: ${hasImage}`);
console.log(`Missing image: ${noImage}`);
console.log(`Have body images we could use: ${bodyImages.length}`);
console.log(`Truly no images anywhere: ${noImage - bodyImages.length}`);
console.log("");

// Group by source
const bySrc = {};
for (const p of missing) {
  const src = p.source || "unknown";
  if (!bySrc[src]) bySrc[src] = [];
  bySrc[src].push(p);
}
console.log("By source:");
for (const [src, posts] of Object.entries(bySrc)) {
  console.log(`  ${src}: ${posts.length}`);
}
console.log("");

// Posts with body images (easy fixes)
if (bodyImages.length > 0) {
  console.log("=== POSTS WITH BODY IMAGES (can promote first image) ===");
  bodyImages.forEach((p) => {
    console.log(`${p.file}`);
    console.log(`  Title: ${p.title}`);
    console.log(`  Image: ${p.imageUrl}`);
    console.log("");
  });
}

// Posts with NO images at all
const noImagesAtAll = missing.filter((p) => p.bodyImageCount === 0);
if (noImagesAtAll.length > 0) {
  console.log(`\n=== POSTS WITH NO IMAGES AT ALL (${noImagesAtAll.length}) ===`);
  noImagesAtAll.sort((a, b) => a.date.localeCompare(b.date));
  noImagesAtAll.forEach((p) => {
    console.log(`${p.date} | ${p.cats.padEnd(15)} | ${p.source.padEnd(10)} | ${p.title}`);
  });
}
