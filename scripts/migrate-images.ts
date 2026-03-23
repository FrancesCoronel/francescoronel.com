/**
 * Image Migration Script: Webflow CDN → Vercel Blob
 *
 * Crawls all MDX and JSON content files for Webflow image URLs,
 * downloads each image, uploads to Vercel Blob, and rewrites URLs in-place.
 *
 * Prerequisites:
 *   1. Set BLOB_READ_WRITE_TOKEN in .env.local
 *   2. Run: npx tsx --env-file=.env.local scripts/migrate-images.ts
 *
 * Blob folder structure:
 *   blog/          — Blog featured + inline images
 *   organizations/ — Org logos
 *   awards/        — Award images
 *   static/        — Misc images
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { put } from "@vercel/blob";

const CONTENT_DIR = path.join(process.cwd(), "content");

const WEBFLOW_CDN_PATTERN = /https?:\/\/cdn\.prod\.website-files\.com\/[^\s"')]+/g;
const UPLOADS_PATTERN = /https?:\/\/uploads-ssl\.webflow\.com\/[^\s"')]+/g;

// ─── Helpers ──────────────────────────────────────────────────

function downloadFile(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadFile(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function filenameFromUrl(url: string): string {
  const parsed = new URL(url);
  return path.basename(parsed.pathname);
}

function folderFromFile(filePath: string): string {
  const relative = path.relative(CONTENT_DIR, filePath);
  if (relative.startsWith("blog")) return "blog";
  if (relative.includes("organizations")) return "organizations";
  if (relative.includes("awards")) return "awards";
  return "static";
}

function contentTypeFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
  };
  return map[ext] ?? "image/jpeg";
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  const urlMap = new Map<string, string>(); // original URL → blob URL
  const filesToProcess: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".json")) {
        filesToProcess.push(full);
      }
    }
  }
  walk(CONTENT_DIR);

  // Collect all unique Webflow URLs, keyed to which files they appear in
  const allUrls = new Set<string>();
  const fileContents = new Map<string, string>();
  const urlToFolder = new Map<string, string>();

  for (const file of filesToProcess) {
    const content = fs.readFileSync(file, "utf-8");
    fileContents.set(file, content);
    const folder = folderFromFile(file);

    for (const match of [...content.matchAll(WEBFLOW_CDN_PATTERN), ...content.matchAll(UPLOADS_PATTERN)]) {
      const url = match[0];
      allUrls.add(url);
      if (!urlToFolder.has(url)) urlToFolder.set(url, folder);
    }
  }

  console.log(`\nFound ${allUrls.size} unique Webflow image URLs across ${filesToProcess.length} files\n`);

  // Download and upload each image to Vercel Blob
  let processed = 0;
  let failed = 0;

  for (const url of allUrls) {
    const filename = filenameFromUrl(url);
    const folder = urlToFolder.get(url) ?? "static";
    const blobPath = `${folder}/${filename}`;
    processed++;

    try {
      process.stdout.write(`  [${processed}/${allUrls.size}] ${filename}... `);
      const buffer = await downloadFile(url);
      const blob = await put(blobPath, buffer, {
        access: "public",
        contentType: contentTypeFromFilename(filename),
        addRandomSuffix: false,
      });
      urlMap.set(url, blob.url);
      console.log(`✅`);
    } catch (err) {
      failed++;
      console.log(`❌ ${err instanceof Error ? err.message : err}`);
    }
  }

  // Rewrite URLs in all content files
  let filesRewritten = 0;
  for (const [file, content] of fileContents) {
    let updated = content;
    for (const [originalUrl, blobUrl] of urlMap) {
      if (updated.includes(originalUrl)) {
        updated = updated.split(originalUrl).join(blobUrl);
      }
    }
    if (updated !== content) {
      fs.writeFileSync(file, updated, "utf-8");
      filesRewritten++;
    }
  }

  console.log(`\n─── Migration Complete ───────────────────────────`);
  console.log(`  Uploaded:  ${urlMap.size} images to Vercel Blob`);
  console.log(`  Failed:    ${failed} images`);
  console.log(`  Files updated: ${filesRewritten}`);
  if (failed > 0) {
    console.log(`\n  Failed URLs kept as-is in content files.`);
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
