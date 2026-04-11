/**
 * Migrate Vercel Blob store → new store
 *
 * Strategy:
 *  1. List all blobs in the OLD store
 *  2. For each blob, reconstruct the original Webflow CDN URL from the filename
 *  3. Download from Webflow CDN (or copy() as fallback)
 *  4. Upload to NEW store at the same path
 *  5. Rewrite all content URLs (old store → new store)
 */

import { list, put, copy } from "@vercel/blob";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, extname } from "path";

const OLD_TOKEN = "vercel_blob_rw_kTEbrBhzG9WAskY1_q2QgBgZ6PrAZaH5vCFYhxGAppPXyet";
const NEW_TOKEN = "vercel_blob_rw_GZQhCZL3EhDy3Foa_hs7QNUEUssQUty5caV4RNOwYimIkR0";
const OLD_BASE = "https://ktebrbhzg9wasky1.public.blob.vercel-storage.com";
const NEW_BASE = "https://gzqhczl3ehdy3foa.public.blob.vercel-storage.com";
const WEBFLOW_CDN = "https://cdn.prod.website-files.com/63b0b035359373d0cc473202";
const CONTENT_DIR = join(process.cwd(), "content");

function mimeType(filename) {
  const ext = extname(filename).toLowerCase();
  return { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
           ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
           ".avif": "image/avif" }[ext] ?? "image/jpeg";
}

// Collect all content files
function collectFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(full));
    else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".json"))
      files.push(full);
  }
  return files;
}

// List ALL blobs in old store
async function listAllBlobs() {
  const blobs = [];
  let cursor;
  do {
    const r = await list({ token: OLD_TOKEN, limit: 1000, cursor });
    blobs.push(...r.blobs);
    cursor = r.cursor;
  } while (cursor);
  return blobs;
}

async function downloadUrl(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; blob-migrator/1.0)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) throw new Error("got HTML response");
  return Buffer.from(await res.arrayBuffer());
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log("Listing blobs in old store...");
const blobs = await listAllBlobs();
console.log(`Found ${blobs.length} blobs\n`);

const urlMap = new Map(); // oldUrl → newUrl
let uploaded = 0, skipped = 0, failed = 0;
const failedBlobs = [];

for (let i = 0; i < blobs.length; i++) {
  const blob = blobs[i];
  // blobPath = "blog/filename.jpg" (strip the base URL)
  const blobPath = blob.url.replace(OLD_BASE + "/", "");
  const filename = blobPath.split("/").pop();
  const newUrl = `${NEW_BASE}/${blobPath}`;

  process.stdout.write(`  [${i + 1}/${blobs.length}] ${filename.slice(0, 50).padEnd(50)} `);

  try {
    // Strategy 1: try Webflow CDN using the filename
    const webflowUrl = `${WEBFLOW_CDN}/${filename}`;
    let buffer;
    let source = "webflow";

    try {
      buffer = await downloadUrl(webflowUrl);
    } catch {
      // Strategy 2: try copy() - Vercel may handle internal routing
      try {
        const copied = await copy(blob.url, blobPath, {
          access: "public",
          token: NEW_TOKEN,
          addRandomSuffix: false,
        });
        urlMap.set(blob.url, copied.url);
        uploaded++;
        console.log("✓ copy");
        continue;
      } catch {
        source = "failed";
      }
    }

    if (source === "failed") {
      failed++;
      failedBlobs.push(blob.url);
      console.log("✗ both sources failed");
      continue;
    }

    const result = await put(blobPath, buffer, {
      access: "public",
      contentType: mimeType(filename),
      addRandomSuffix: false,
      token: NEW_TOKEN,
    });

    urlMap.set(blob.url, result.url);
    uploaded++;
    console.log(`✓ webflow (${(buffer.length / 1024).toFixed(0)}KB)`);
  } catch (err) {
    failed++;
    failedBlobs.push(blob.url);
    console.log(`✗ ${err.message}`);
  }
}

console.log(`\n─── Upload complete: ${uploaded} ok, ${failed} failed ───\n`);

if (urlMap.size === 0) {
  console.log("No URLs to rewrite. Exiting.");
  process.exit(1);
}

// Rewrite content files
console.log("Rewriting content files...");
const files = collectFiles(CONTENT_DIR);
let filesUpdated = 0;

for (const file of files) {
  let content = readFileSync(file, "utf-8");
  let modified = false;
  for (const [oldUrl, newUrl] of urlMap) {
    if (content.includes(oldUrl)) {
      content = content.split(oldUrl).join(newUrl);
      modified = true;
    }
  }
  if (modified) {
    writeFileSync(file, content, "utf-8");
    filesUpdated++;
  }
}

console.log(`Updated ${filesUpdated} files\n`);
console.log(`=== Summary ===`);
console.log(`Blobs migrated: ${uploaded}`);
console.log(`Failed:         ${failed}`);
console.log(`Files updated:  ${filesUpdated}`);

if (failedBlobs.length > 0) {
  console.log(`\nFailed blobs (still pointing to old store):`);
  failedBlobs.forEach(u => console.log("  " + u));
}
