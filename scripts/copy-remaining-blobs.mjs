import { put } from "@vercel/blob";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, extname } from "path";

const OLD_BASE = "https://ktebrbhzg9wasky1.public.blob.vercel-storage.com";
const NEW_BASE = "https://gzqhczl3ehdy3foa.public.blob.vercel-storage.com";
const NEW_TOKEN = "vercel_blob_rw_GZQhCZL3EhDy3Foa_hs7QNUEUssQUty5caV4RNOwYimIkR0";
const CONTENT_DIR = join(process.cwd(), "content");

const missing = readFileSync("scripts/missing-images.txt", "utf-8")
  .trim().split("\n").filter(Boolean);

function mime(f) {
  const e = extname(f.split("?")[0]).toLowerCase();
  return { ".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",
           ".gif":"image/gif",".webp":"image/webp",".svg":"image/svg+xml",
           ".avif":"image/avif",".pdf":"application/pdf" }[e] ?? "application/octet-stream";
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

const urlMap = new Map();
let ok = 0, failed = 0;

for (let i = 0; i < missing.length; i++) {
  const oldUrl = missing[i];
  const blobPath = oldUrl.replace(OLD_BASE + "/", "");
  const filename = blobPath.split("/").pop();
  process.stdout.write(`  [${i+1}/${missing.length}] ${filename.slice(0,50).padEnd(50)} `);

  try {
    const res = await fetch(oldUrl, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const result = await put(blobPath, buf, {
      access: "public", contentType: mime(filename),
      addRandomSuffix: false, token: NEW_TOKEN,
    });
    urlMap.set(oldUrl, result.url);
    ok++;
    console.log(`✓ (${(buf.length/1024).toFixed(0)}KB)`);
  } catch (err) {
    failed++;
    console.log(`✗ ${err.message}`);
  }
}

console.log(`\nUploaded: ${ok}, Failed: ${failed}\n`);

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
  console.log(`Files updated: ${updated}`);
}

if (failed > 0) console.log(`\n${failed} images still need manual upload.`);
else console.log("All images migrated! You can downgrade the old account now.");
