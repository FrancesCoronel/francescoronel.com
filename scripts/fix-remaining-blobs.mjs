import { put } from "@vercel/blob";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, extname } from "path";

const NEW_TOKEN = "vercel_blob_rw_GZQhCZL3EhDy3Foa_hs7QNUEUssQUty5caV4RNOwYimIkR0";
const NEW_BASE = "https://gzqhczl3ehdy3foa.public.blob.vercel-storage.com";
const OLD_BASE = "https://ktebrbhzg9wasky1.public.blob.vercel-storage.com";
const WEBFLOW_CDN = "https://cdn.prod.website-files.com/63b0b035359373d0cc473202";
const CONTENT_DIR = join(process.cwd(), "content");

const failedUrls = readFileSync("/tmp/failed-blobs.txt", "utf-8").trim().split("\n");

function mime(f) {
  const e = extname(f.split("?")[0]).toLowerCase();
  return { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
           ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
           ".avif": "image/avif" }[e] ?? "image/jpeg";
}

function collectFiles(dir) {
  const files = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...collectFiles(full));
    else if (e.name.endsWith(".mdx") || e.name.endsWith(".json")) files.push(full);
  }
  return files;
}

async function tryDownload(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const ct = r.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) throw new Error("HTML");
  return Buffer.from(await r.arrayBuffer());
}

const urlMap = new Map();
const stillFailed = [];

for (const oldUrl of failedUrls) {
  const blobPath = oldUrl.replace(OLD_BASE + "/", "");
  const filename = blobPath.split("/").pop();
  const decodedFilename = decodeURIComponent(filename);

  process.stdout.write(filename.slice(0, 50).padEnd(50) + " ");

  const attempts = [
    WEBFLOW_CDN + "/" + decodedFilename,
    WEBFLOW_CDN + "/" + filename,
  ];

  let uploaded = false;
  for (const attempt of attempts) {
    try {
      const buf = await tryDownload(attempt);
      const result = await put(blobPath, buf, {
        access: "public", contentType: mime(filename),
        addRandomSuffix: false, token: NEW_TOKEN,
      });
      urlMap.set(oldUrl, result.url);
      process.stdout.write("✓ webflow\n");
      uploaded = true;
      break;
    } catch {}
  }

  if (!uploaded) {
    stillFailed.push(oldUrl);
    process.stdout.write("✗ needs manual upload\n");
  }
}

if (urlMap.size > 0) {
  let updated = 0;
  for (const f of collectFiles(CONTENT_DIR)) {
    let content = readFileSync(f, "utf-8");
    let mod = false;
    for (const [o, n] of urlMap) {
      if (content.includes(o)) { content = content.split(o).join(n); mod = true; }
    }
    if (mod) { writeFileSync(f, content); updated++; }
  }
  console.log(`\nFixed: ${urlMap.size}, Files updated: ${updated}`);
}

writeFileSync("/tmp/still-failed.txt", stillFailed.join("\n"));
console.log(`Still needs manual upload: ${stillFailed.length}`);
if (stillFailed.length > 0) {
  stillFailed.forEach(u => console.log("  " + u));
}
