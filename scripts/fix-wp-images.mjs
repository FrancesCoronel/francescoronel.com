/**
 * Fix broken WordPress images in blog posts using the WP media export.
 *
 * Usage: node scripts/fix-wp-images.mjs
 *
 * Reads the WP media export from ~/Downloads, copies matching images to
 * public/images/wp-uploads/, and rewrites MDX file URLs.
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, basename } from "path";

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

const PROJECT_DIR = process.cwd();
const CONTENT_DIR = join(PROJECT_DIR, "content/blog");
const UPLOAD_DIR = join(PROJECT_DIR, "public/images/wp-uploads");
const WP_EXPORT_DIR =
  process.env.WP_EXPORT_DIR ||
  join(process.env.HOME, "Documents/Website/media-export-176054289-from-0-to-36169");

// All broken WordPress URL patterns
const WP_URL_RE =
  /https?:\/\/fvcproductions39789812\.wordpress\.com\/wp-content\/uploads\/(\d{4})\/(\d{2})\/([^)\s"?]+)/g;
const WP_FILES_RE =
  /https?:\/\/fvcproductions\.files\.wordpress\.com\/(\d{4})\/(\d{2})\/([^)\s"?]+)/g;

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Build a map of all available files in the WP export: filename -> full path
const exportFiles = new Map();
const allExportFiles = walkDir(WP_EXPORT_DIR).map((f) => f.slice(WP_EXPORT_DIR.length + 1));
for (const f of allExportFiles) {
  const name = basename(f).toLowerCase();
  exportFiles.set(name, join(WP_EXPORT_DIR, f));
  // Also index by year/month/filename for exact path matching
  exportFiles.set(f.toLowerCase(), join(WP_EXPORT_DIR, f));
}

console.log(`WP Export: ${allExportFiles.length} files indexed`);
console.log(`Target:    ${UPLOAD_DIR}\n`);

// Process all MDX files
const mdxFiles = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
let totalCopied = 0;
let totalReplaced = 0;
let totalMissing = 0;
const missingImages = new Set();
const copiedFiles = new Set();

for (const file of mdxFiles) {
  const filePath = join(CONTENT_DIR, file);
  let content = readFileSync(filePath, "utf-8");
  let modified = false;

  // Process fvcproductions39789812.wordpress.com URLs
  for (const match of content.matchAll(new RegExp(WP_URL_RE.source, "g"))) {
    const fullUrl = match[0];
    const [, year, month, filename] = match;
    const localFilename = filename;
    const localPath = `/images/wp-uploads/${localFilename}`;

    // Try to find the file in the export
    const exportPath =
      exportFiles.get(`${year}/${month}/${filename}`.toLowerCase()) ||
      exportFiles.get(filename.toLowerCase());

    if (exportPath && existsSync(exportPath)) {
      // Copy to public/images/wp-uploads/
      const destPath = join(UPLOAD_DIR, localFilename);
      if (!copiedFiles.has(localFilename)) {
        copyFileSync(exportPath, destPath);
        copiedFiles.add(localFilename);
        totalCopied++;
      }
      content = content.split(fullUrl).join(localPath);
      totalReplaced++;
      modified = true;
    } else {
      missingImages.add(filename);
      totalMissing++;
    }
  }

  // Process fvcproductions.files.wordpress.com URLs
  for (const match of content.matchAll(
    new RegExp(WP_FILES_RE.source, "g")
  )) {
    const fullUrl = match[0];
    const [, year, month, filename] = match;
    const localFilename = filename;
    const localPath = `/images/wp-uploads/${localFilename}`;

    const exportPath =
      exportFiles.get(`${year}/${month}/${filename}`.toLowerCase()) ||
      exportFiles.get(filename.toLowerCase());

    if (exportPath && existsSync(exportPath)) {
      const destPath = join(UPLOAD_DIR, localFilename);
      if (!copiedFiles.has(localFilename)) {
        copyFileSync(exportPath, destPath);
        copiedFiles.add(localFilename);
        totalCopied++;
      }
      content = content.split(fullUrl).join(localPath);
      totalReplaced++;
      modified = true;
    } else {
      missingImages.add(filename);
      totalMissing++;
    }
  }

  // Also handle URLs with query params (e.g., ?w=1024&h=655)
  const queryParamRe =
    /https?:\/\/fvcproductions39789812\.wordpress\.com\/wp-content\/uploads\/(\d{4})\/(\d{2})\/([^)\s"]+)/g;
  for (const match of content.matchAll(queryParamRe)) {
    const fullUrl = match[0];
    const [, year, month, filenameWithParams] = match;
    const filename = filenameWithParams.split("?")[0];
    const localPath = `/images/wp-uploads/${filename}`;

    if (copiedFiles.has(filename)) {
      content = content.split(fullUrl).join(localPath);
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(filePath, content);
    console.log(`  Updated: ${file}`);
  }
}

// Also handle http:// (non-https) URLs
console.log("");
const httpMdxFiles = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
for (const file of httpMdxFiles) {
  const filePath = join(CONTENT_DIR, file);
  let content = readFileSync(filePath, "utf-8");

  if (/\bhttp:\/\/fvcproductions39789812\.wordpress\.com\b/.test(content)) {
    for (const localFilename of copiedFiles) {
      if (/\bhttp:\/\/fvcproductions39789812\.wordpress\.com\/wp-content\/uploads\b/.test(content)) {
        // Replace any remaining http:// variants
        content = content.replace(
          /http:\/\/fvcproductions39789812\.wordpress\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/([^)\s"?]+)/g,
          (match, fn) => {
            const clean = fn.split("?")[0];
            if (copiedFiles.has(clean)) {
              return `/images/wp-uploads/${clean}`;
            }
            return match;
          }
        );
        writeFileSync(filePath, content);
        console.log(`  Fixed http:// URLs in: ${file}`);
        break;
      }
    }
  }
}

console.log(`\n=== Summary ===`);
console.log(`Images copied:    ${totalCopied}`);
console.log(`URLs replaced:    ${totalReplaced}`);
console.log(`Still missing:    ${missingImages.size} unique files\n`);

if (missingImages.size > 0) {
  console.log("=== Still missing ===");
  for (const f of missingImages) {
    console.log(`  ${f}`);
  }
}
