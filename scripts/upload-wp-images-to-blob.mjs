/**
 * Upload all WordPress images to Vercel Blob and update MDX files.
 *
 * Handles two cases:
 *  1. Images already copied to public/images/wp-uploads/ — upload + rewrite paths
 *  2. Remaining //fvcproductions.files.wordpress.com URLs — find in export, upload + rewrite
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN="..." node scripts/upload-wp-images-to-blob.mjs
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, extname, basename } from "path";
import { put } from "@vercel/blob";

const PROJECT_DIR = process.cwd();
const CONTENT_DIR = join(PROJECT_DIR, "content/blog");
const LOCAL_UPLOADS = join(PROJECT_DIR, "public/images/wp-uploads");
const WP_EXPORT_DIR =
  process.env.WP_EXPORT_DIR ||
  join(process.env.HOME, "Documents/Website/media-export-176054289-from-0-to-36169");
const BLOB_FOLDER = "blog";

// Regex for remaining //fvcproductions.files.wordpress.com image URLs
const WP_FILES_RE =
  /(?:https?:)?\/\/fvcproductions\.files\.wordpress\.com\/(\d{4})\/(\d{2})\/([^)\s"?#]+)/g;

// Mime type helper
function mimeType(filename) {
  const ext = extname(filename).toLowerCase();
  const map = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return map[ext] || "application/octet-stream";
}

/** Recursively list all files under a directory */
function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else results.push(full);
  }
  return results;
}

// --- Phase 1: Upload images already in public/images/wp-uploads/ ---
console.log("=== Phase 1: Uploading public/images/wp-uploads/ to Vercel Blob ===\n");

const uploadedMap = new Map(); // localFilename -> blobUrl
const localFiles = readdirSync(LOCAL_UPLOADS);

for (const filename of localFiles) {
  const filePath = join(LOCAL_UPLOADS, filename);
  const buffer = readFileSync(filePath);
  const blobPath = `${BLOB_FOLDER}/${filename}`;

  try {
    const blob = await put(blobPath, buffer, {
      access: "public",
      contentType: mimeType(filename),
      addRandomSuffix: false,
    });
    uploadedMap.set(filename, blob.url);
    console.log(`  ✓ ${filename}`);
  } catch (err) {
    console.error(`  ✗ ${filename}: ${err.message}`);
  }
}

console.log(`\nUploaded ${uploadedMap.size} files.\n`);

// --- Phase 2: Update MDX files — replace /images/wp-uploads/FILENAME?... with blob URL ---
console.log("=== Phase 2: Rewriting MDX paths to Vercel Blob URLs ===\n");

const mdxFiles = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
let totalReplaced = 0;

for (const file of mdxFiles) {
  const filePath = join(CONTENT_DIR, file);
  let content = readFileSync(filePath, "utf-8");
  let modified = false;

  // Replace /images/wp-uploads/FILENAME (with or without query params)
  const localPathRe = /\/images\/wp-uploads\/([^)\s"?#]+)(?:\?[^)\s"]*)?/g;
  for (const match of content.matchAll(localPathRe)) {
    const fullMatch = match[0];
    const filename = match[1];
    const blobUrl = uploadedMap.get(filename);
    if (blobUrl) {
      content = content.split(fullMatch).join(blobUrl);
      totalReplaced++;
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(filePath, content);
    console.log(`  Updated: ${file}`);
  }
}

// --- Phase 3: Handle remaining //fvcproductions.files.wordpress.com URLs ---
console.log("\n=== Phase 3: Uploading remaining fvcproductions.files.wordpress.com images ===\n");

// Build export index
const exportFiles = new Map();
if (existsSync(WP_EXPORT_DIR)) {
  const allExportFiles = walkDir(WP_EXPORT_DIR).map((f) => f.slice(WP_EXPORT_DIR.length + 1));
  for (const f of allExportFiles) {
    exportFiles.set(f.toLowerCase(), join(WP_EXPORT_DIR, f));
    exportFiles.set(basename(f).toLowerCase(), join(WP_EXPORT_DIR, f));
  }
  console.log(`WP Export indexed: ${allExportFiles.length} files`);
} else {
  console.log(`WP Export not found at ${WP_EXPORT_DIR} — skipping Phase 3`);
}

let phase3Missing = 0;

for (const file of mdxFiles) {
  const filePath = join(CONTENT_DIR, file);
  let content = readFileSync(filePath, "utf-8");
  let modified = false;

  for (const match of content.matchAll(new RegExp(WP_FILES_RE.source, "g"))) {
    const fullUrl = match[0];
    const [, year, month, filename] = match;

    // Check if already uploaded
    if (uploadedMap.has(filename)) {
      content = content.split(fullUrl).join(uploadedMap.get(filename));
      modified = true;
      continue;
    }

    // Find in export
    const exportPath =
      exportFiles.get(`${year}/${month}/${filename}`.toLowerCase()) ||
      exportFiles.get(filename.toLowerCase());

    if (exportPath && existsSync(exportPath)) {
      const buffer = readFileSync(exportPath);
      const blobPath = `${BLOB_FOLDER}/${filename}`;
      try {
        const blob = await put(blobPath, buffer, {
          access: "public",
          contentType: mimeType(filename),
          addRandomSuffix: false,
        });
        uploadedMap.set(filename, blob.url);
        content = content.split(fullUrl).join(blob.url);
        modified = true;
        console.log(`  ✓ ${filename}`);
      } catch (err) {
        console.error(`  ✗ ${filename}: ${err.message}`);
        phase3Missing++;
      }
    } else {
      console.warn(`  ? Not found in export: ${filename}`);
      phase3Missing++;
    }
  }

  if (modified) {
    writeFileSync(filePath, content);
    console.log(`  Updated: ${file}`);
  }
}

console.log(`\n=== Summary ===`);
console.log(`Images uploaded to Blob: ${uploadedMap.size}`);
console.log(`MDX paths replaced:      ${totalReplaced}`);
console.log(`Still missing:           ${phase3Missing}`);
