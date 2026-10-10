import { list } from "@vercel/blob";
const OLD_TOKEN = process.env.OLD_BLOB_READ_WRITE_TOKEN;
const NEW_TOKEN = process.env.NEW_BLOB_READ_WRITE_TOKEN;
const OLD_BASE = "https://ktebrbhzg9wasky1.public.blob.vercel-storage.com/";
const NEW_BASE = "https://gzqhczl3ehdy3foa.public.blob.vercel-storage.com/";

async function getAll(token, base) {
  const paths = new Set();
  let cursor;
  do {
    const r = await list({ token, limit: 1000, cursor });
    for (const b of r.blobs) paths.add(b.url.replace(base, ""));
    cursor = r.cursor;
  } while (cursor);
  return paths;
}

const [oldPaths, newPaths] = await Promise.all([getAll(OLD_TOKEN, OLD_BASE), getAll(NEW_TOKEN, NEW_BASE)]);
const missing = [...oldPaths].filter(p => !newPaths.has(p));
console.log(`Old: ${oldPaths.size}, New: ${newPaths.size}, Missing from new: ${missing.length}`);
missing.forEach(p => console.log(" ", p));
