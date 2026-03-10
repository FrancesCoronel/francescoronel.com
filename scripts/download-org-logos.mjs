#!/usr/bin/env node

/**
 * Download organization logos from Webflow CDN to local files
 * and update organizations.json with local paths.
 *
 * Usage: node scripts/download-org-logos.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const JSON_PATH = path.join(ROOT, 'content/organizations.json');
const OUTPUT_DIR = path.join(ROOT, 'public/images/organizations');

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Read the JSON
const orgs = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

// Map content-type to extension
function extFromContentType(ct) {
  if (!ct) return null;
  ct = ct.toLowerCase();
  if (ct.includes('image/png')) return 'png';
  if (ct.includes('image/jpeg') || ct.includes('image/jpg')) return 'jpg';
  if (ct.includes('image/svg+xml')) return 'svg';
  if (ct.includes('image/gif')) return 'gif';
  if (ct.includes('image/webp')) return 'webp';
  return null;
}

// Infer extension from URL path as fallback
function extFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i);
    if (match) {
      const ext = match[1].toLowerCase();
      return ext === 'jpeg' ? 'jpg' : ext;
    }
  } catch { /* ignore */ }
  return null;
}

let downloaded = 0;
let skipped = 0;
let failed = 0;

for (const org of orgs) {
  if (!org.logo || org.logo.trim() === '') {
    skipped++;
    continue;
  }

  // Already a local path? Skip.
  if (org.logo.startsWith('/images/')) {
    console.log(`SKIP (already local): ${org.slug}`);
    skipped++;
    continue;
  }

  const url = org.logo;
  const urlExt = extFromUrl(url);

  // Download to a temp file first, then determine extension
  const tempFile = path.join(OUTPUT_DIR, `${org.slug}.tmp`);

  try {
    // Use wget to download. --server-response prints headers so we can parse Content-Type.
    // Save to temp file.
    const result = execSync(
      `wget --server-response --timeout=30 --tries=2 -O "${tempFile}" "${url}" 2>&1`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );

    // Parse Content-Type from wget server-response output
    let ext = null;
    const ctMatch = result.match(/Content-Type:\s*([^\s;]+)/i);
    if (ctMatch) {
      ext = extFromContentType(ctMatch[1]);
    }

    // Fallback to URL extension
    if (!ext) {
      ext = urlExt;
    }

    // Fallback: check file magic bytes
    if (!ext) {
      const buf = Buffer.alloc(8);
      const fd = fs.openSync(tempFile, 'r');
      fs.readSync(fd, buf, 0, 8, 0);
      fs.closeSync(fd);

      if (buf[0] === 0x89 && buf[1] === 0x50) ext = 'png';
      else if (buf[0] === 0xFF && buf[1] === 0xD8) ext = 'jpg';
      else if (buf.toString('utf-8', 0, 4) === '<svg' || buf.toString('utf-8', 0, 5) === '<?xml') ext = 'svg';
      else ext = 'png'; // default to png
    }

    const finalFile = path.join(OUTPUT_DIR, `${org.slug}.${ext}`);
    fs.renameSync(tempFile, finalFile);

    // Update the org's logo field to the local path
    org.logo = `/images/organizations/${org.slug}.${ext}`;
    downloaded++;
    console.log(`OK: ${org.slug} -> ${org.logo}`);
  } catch (err) {
    // Clean up temp file if it exists
    try { fs.unlinkSync(tempFile); } catch { /* ignore */ }
    console.error(`FAIL: ${org.slug} - ${err.message.split('\n')[0]}`);
    failed++;
    // Keep original URL on failure
  }
}

// Write updated JSON back
fs.writeFileSync(JSON_PATH, JSON.stringify(orgs, null, 2) + '\n', 'utf-8');

console.log(`\nDone! Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
console.log(`Updated: ${JSON_PATH}`);
