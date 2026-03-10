/**
 * Image Migration Script: Webflow CDN → Cloudinary
 *
 * Crawls all MDX and JSON content files for Webflow image URLs,
 * downloads each image, uploads to Cloudinary, and rewrites URLs.
 *
 * Prerequisites:
 *   1. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env.local
 *   2. Run: npx tsx scripts/migrate-images.ts
 *
 * Cloudinary folder structure:
 *   francescoronel/
 *   ├── blog/          — Blog featured + inline images
 *   ├── organizations/ — Org logos
 *   ├── awards/        — Award images
 *   ├── static/        — Memoji, hero images, 3D illustrations
 *   └── og/            — Open Graph images
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "francescoronel";
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error("Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET in environment");
  process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────

const WEBFLOW_CDN_PATTERN = /https?:\/\/cdn\.prod\.website-files\.com\/[^\s"')]+/g;
const UPLOADS_PATTERN = /https?:\/\/uploads-ssl\.webflow\.com\/[^\s"')]+/g;

function downloadFile(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadFile(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  filename: string
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `${folder}/${filename}`;

  // Use the upload API
  const formData = new FormData();
  formData.append("file", new Blob([buffer]));
  formData.append("public_id", publicId);
  formData.append("api_key", API_KEY!);
  formData.append("timestamp", timestamp.toString());

  // Generate signature
  const crypto = await import("crypto");
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto.createHash("sha1").update(signatureString).digest("hex");
  formData.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.public_id as string;
}

function filenameFromUrl(url: string): string {
  const parsed = new URL(url);
  const basename = path.basename(parsed.pathname);
  // Remove Webflow hash suffix (e.g., "image_abc123.jpg" → "image.jpg")
  return basename.replace(/[_-][a-f0-9]{6,}\./i, ".");
}

function folderForFile(filePath: string): string {
  const relative = path.relative(CONTENT_DIR, filePath);
  if (relative.startsWith("blog")) return "blog";
  if (relative.includes("organizations")) return "organizations";
  if (relative.includes("awards")) return "awards";
  if (relative.includes("education")) return "education";
  if (relative.includes("experience")) return "experience";
  return "static";
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const urlMap = new Map<string, string>(); // original URL → cloudinary public_id
  const filesToProcess: string[] = [];

  // Gather all content files
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".json")) {
        filesToProcess.push(full);
      }
    }
  }
  walk(CONTENT_DIR);

  // Find all Webflow image URLs
  const allUrls = new Set<string>();
  const fileContents = new Map<string, string>();

  for (const file of filesToProcess) {
    const content = fs.readFileSync(file, "utf-8");
    fileContents.set(file, content);

    const matches = [
      ...content.matchAll(WEBFLOW_CDN_PATTERN),
      ...content.matchAll(UPLOADS_PATTERN),
    ];
    for (const match of matches) {
      allUrls.add(match[0]);
    }
  }

  console.log(`Found ${allUrls.size} unique Webflow image URLs across ${filesToProcess.length} files`);

  // Download and upload each image
  let processed = 0;
  for (const url of allUrls) {
    try {
      const filename = filenameFromUrl(url);
      // Determine folder based on URL pattern or a default
      const folder = url.includes("blog") ? "blog" : "static";

      console.log(`  [${++processed}/${allUrls.size}] ${filename}...`);
      const buffer = await downloadFile(url);
      const publicId = await uploadToCloudinary(buffer, folder, filename.replace(/\.[^.]+$/, ""));
      urlMap.set(url, `cloudinary://${publicId}`);
    } catch (err) {
      console.error(`  Failed to migrate ${url}:`, err);
      // Keep the original URL if migration fails
    }
  }

  // Rewrite URLs in all content files
  let rewritten = 0;
  for (const [file, content] of fileContents) {
    let updated = content;
    for (const [originalUrl, cloudinaryRef] of urlMap) {
      if (updated.includes(originalUrl)) {
        updated = updated.split(originalUrl).join(cloudinaryRef);
        rewritten++;
      }
    }
    if (updated !== content) {
      fs.writeFileSync(file, updated, "utf-8");
    }
  }

  console.log(`\nImage Migration Complete:`);
  console.log(`  Uploaded: ${urlMap.size} images to Cloudinary`);
  console.log(`  Rewrote: ${rewritten} URL references`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
