/**
 * Find all external image URLs in MDX and JSON content files,
 * download them, upload to Vercel Blob, and rewrite the source files.
 *
 * Usage: BLOB_READ_WRITE_TOKEN="..." node scripts/upload-external-images-to-blob.mjs
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { join, extname, basename } from "path";
import { put } from "@vercel/blob";

const PROJECT_DIR = process.cwd();
const CONTENT_DIR = join(PROJECT_DIR, "content");
const BLOB_FOLDER = "blog";

// Skip URLs that are already on Vercel Blob or are not images
const SKIP_PATTERNS = [
  "blob.vercel-storage.com",
  "videopress.com",
  "youtube.com",
  "youtu.be",
  "twitter.com",
  "x.com",
];

// Image extensions to consider
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"]);

function mimeType(filename) {
  const ext = extname(filename).toLowerCase();
  return (
    {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".avif": "image/avif",
    }[ext] || "application/octet-stream"
  );
}

function normalizeUrl(url) {
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

function shouldSkip(url) {
  return SKIP_PATTERNS.some((p) => url.includes(p));
}

function isImageUrl(url) {
  // Strip query params for extension check
  const clean = url.split("?")[0].split("#")[0];
  return IMAGE_EXTS.has(extname(clean).toLowerCase());
}

function slugifyFilename(url) {
  // Extract filename from URL, strip query params
  const clean = url.split("?")[0].split("#")[0];
  const name = basename(clean);
  // Sanitize
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

// Collect all MDX and JSON files in content/
function collectFiles() {
  const files = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".json")) {
        files.push(full);
      }
    }
  }
  walk(CONTENT_DIR);
  return files;
}

// Extract all external image URLs from a string
function extractImageUrls(content) {
  const urls = new Set();

  // Markdown images: ![alt](url) and ![alt](url "title")
  for (const m of content.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s"]+|\/\/[^)\s"]+)/g)) {
    urls.add(m[1]);
  }

  // HTML img src
  for (const m of content.matchAll(/src=["'](https?:\/\/[^"']+|\/\/[^"']+)["']/g)) {
    urls.add(m[1]);
  }

  // JSON string values that look like image URLs
  for (const m of content.matchAll(/"(https?:\/\/[^"]+)"/g)) {
    if (isImageUrl(m[1])) urls.add(m[1]);
  }

  // Protocol-relative in JSON
  for (const m of content.matchAll(/"(\/\/[^"]+)"/g)) {
    if (isImageUrl(m[1])) urls.add(m[1]);
  }

  return [...urls].filter((u) => isImageUrl(u) && !shouldSkip(u));
}

// --- Main ---
const allFiles = collectFiles();
console.log(`Scanning ${allFiles.length} files...\n`);

// Collect all unique URLs across all files
const urlToFiles = new Map(); // url -> [filePath, ...]
for (const file of allFiles) {
  const content = readFileSync(file, "utf-8");
  for (const url of extractImageUrls(content)) {
    if (!urlToFiles.has(url)) urlToFiles.set(url, []);
    urlToFiles.get(url).push(file);
  }
}

console.log(`Found ${urlToFiles.size} unique external image URLs\n`);

// Upload each URL and build replacement map
const replacements = new Map(); // originalUrl -> blobUrl
let uploaded = 0;
let failed = 0;
let skipped = 0;

for (const [url, files] of urlToFiles) {
  const normalized = normalizeUrl(url);
  const filename = slugifyFilename(normalized);
  const blobPath = `${BLOB_FOLDER}/${filename}`;

  process.stdout.write(`  Downloading ${filename}...`);

  try {
    const res = await fetch(normalized, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; site-archiver/1.0)" },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.log(` ✗ HTTP ${res.status} — skipping`);
      failed++;
      continue;
    }

    const contentType = res.headers.get("content-type") || mimeType(filename);
    // Skip HTML responses (redirect/404 pages served as HTML)
    if (contentType.includes("text/html")) {
      console.log(` ✗ got HTML response — skipping`);
      failed++;
      continue;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 100) {
      console.log(` ✗ too small (${buffer.length}B) — skipping`);
      failed++;
      continue;
    }

    const blob = await put(blobPath, buffer, {
      access: "public",
      contentType: contentType.split(";")[0].trim(),
      addRandomSuffix: false,
    });

    replacements.set(url, blob.url);
    uploaded++;
    console.log(` ✓ (${buffer.length} bytes)`);
  } catch (err) {
    console.log(` ✗ ${err.message}`);
    failed++;
  }
}

console.log(`\nUploaded: ${uploaded}, Failed/Skipped: ${failed}\n`);

// Rewrite all files
console.log("Rewriting files...\n");
let filesUpdated = 0;
let totalReplacements = 0;

for (const file of allFiles) {
  let content = readFileSync(file, "utf-8");
  let modified = false;

  for (const [original, blobUrl] of replacements) {
    if (content.includes(original)) {
      content = content.split(original).join(blobUrl);
      modified = true;
      totalReplacements++;
    }
  }

  if (modified) {
    writeFileSync(file, content);
    console.log(`  Updated: ${file.replace(PROJECT_DIR + "/", "")}`);
    filesUpdated++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Images uploaded to Blob: ${uploaded}`);
console.log(`Failed/unreachable:      ${failed}`);
console.log(`Files updated:           ${filesUpdated}`);
console.log(`Total URL replacements:  ${totalReplacements}`);
