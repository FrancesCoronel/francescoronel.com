import { list, del } from "@vercel/blob";

const OLD_TOKEN = process.env.OLD_BLOB_READ_WRITE_TOKEN;

let cursor;
let total = 0;

do {
  const { blobs, cursor: next } = await list({ token: OLD_TOKEN, limit: 1000, cursor });
  if (blobs.length === 0) break;

  const urls = blobs.map(b => b.url);
  await del(urls, { token: OLD_TOKEN });

  total += blobs.length;
  console.log(`Deleted ${total} blobs...`);
  cursor = next;
} while (cursor);

console.log(`\nDone. Total deleted: ${total}`);
