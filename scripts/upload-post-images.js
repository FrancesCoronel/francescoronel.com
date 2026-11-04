#!/usr/bin/env node
/**
 * Move new post images from public/images/ to Vercel Blob.
 *
 * Lets Claude Code (or anyone without a local Blob token, like a phone
 * session) add images to a post by committing them under public/images/.
 * The upload-post-images workflow runs this on the branch, then commits the
 * result.
 *
 * Usage:
 *   node scripts/upload-post-images.js [--base origin/main] [--dry-run]
 *
 * Required env vars (not needed with --dry-run):
 *   BLOB_READ_WRITE_TOKEN: Vercel Blob read/write token for store_GZQhCZL3EhDy3Foa
 *
 * The script:
 *   1. Finds image files added under public/images/ since --base
 *   2. Keeps the ones referenced by a post in content/posts/
 *   3. Uploads each to Blob, keeping its folder (public/images/speaking/a.jpg -> speaking/a.jpg)
 *   4. Swaps "/images/..." for the Blob URL in every post that references it
 *   5. Deletes the local copy once nothing else in the repo points at it
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};
// Places outside the posts that may point at a public/images file
const OTHER_REF_DIRS = ["app", "components", "lib", "content", "public"];

function git(...args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function parseArgs(argv) {
  const args = { base: "origin/main", dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") args.dryRun = true;
    else if (argv[i] === "--base") args.base = argv[++i];
  }
  return args;
}

function addedImages(base) {
  const out = git("diff", "--name-only", "--diff-filter=A", `${base}...HEAD`, "--", "public/images");
  return out
    .split("\n")
    .filter((f) => f && IMAGE_EXT.test(f) && fs.existsSync(path.join(ROOT, f)));
}

function postFiles() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(POSTS_DIR, f));
}

// "/images/speaking/a.jpeg" only when followed by a quote, ) or whitespace,
// so "/images/a.jpeg" never matches inside "/images/a.jpeg.bak"
function refPattern(publicPath) {
  const escaped = publicPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${escaped}(?=["')\\s]|$)`, "g");
}

function stillReferenced(publicPath) {
  try {
    execFileSync(
      "git",
      ["grep", "-q", "-F", publicPath, "--", ...OTHER_REF_DIRS, ":!public/images"],
      { cwd: ROOT, stdio: "ignore" }
    );
    return true;
  } catch {
    return false; // git grep exits 1 when nothing matches
  }
}

async function upload(file, blobPath) {
  const { put } = require("@vercel/blob");
  const contentType = CONTENT_TYPES[path.extname(file).toLowerCase()];
  const blob = await put(blobPath, fs.readFileSync(path.join(ROOT, file)), {
    access: "public",
    contentType,
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}

async function main() {
  const { base, dryRun } = parseArgs(process.argv.slice(2));
  if (!dryRun && !process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("Error: BLOB_READ_WRITE_TOKEN is not set.");
    process.exit(1);
  }

  const posts = postFiles().map((file) => ({ file, text: fs.readFileSync(file, "utf8") }));
  const moved = [];

  for (const file of addedImages(base)) {
    const publicPath = "/" + path.relative(path.join(ROOT, "public"), path.join(ROOT, file)).split(path.sep).join("/");
    const users = posts.filter((p) => refPattern(publicPath).test(p.text));
    if (users.length === 0) continue;

    const blobPath = publicPath.replace(/^\/images\//, "");
    const url = dryRun ? `https://blob.example/${blobPath}` : await upload(file, blobPath);

    for (const post of users) {
      post.text = post.text.replace(refPattern(publicPath), url);
      post.changed = true;
    }
    moved.push({ file, publicPath, url, posts: users.map((p) => path.relative(ROOT, p.file)) });
  }

  if (moved.length === 0) {
    console.log("No new post images to move.");
    return;
  }

  for (const post of posts) {
    if (post.changed && !dryRun) fs.writeFileSync(post.file, post.text);
  }

  for (const item of moved) {
    item.deleted = !dryRun && !stillReferenced(item.publicPath);
    if (item.deleted) git("rm", "-q", item.file);
    console.log(`${item.file} -> ${item.url} (${item.posts.join(", ")})${item.deleted ? ", local copy removed" : ""}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
