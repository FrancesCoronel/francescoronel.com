import { createHash, timingSafeEqual } from "node:crypto";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Lets a Claude session (or any script) host a social media graphic without
// holding the Blob token: POST the image bytes with the x-upload-token header
// and get back a public Blob URL to attach to a Buffer post.
//
//   curl -X POST "https://francescoronel.com/api/social-upload?name=my-graphic" \
//     -H "x-upload-token: $SOCIAL_UPLOAD_TOKEN" --data-binary @my-graphic.png

// Vercel rejects request bodies over 4.5 MB before they reach the function
const MAX_BYTES = 4 * 1024 * 1024;

type ImageType = { ext: string; contentType: string };

// The type comes from the file's own bytes, not from a header the caller picks,
// so the endpoint can only ever store real images
function detectImageType(bytes: Uint8Array): ImageType | null {
  const startsWith = (signature: number[], offset = 0) =>
    signature.every((byte, i) => bytes[offset + i] === byte);

  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { ext: "png", contentType: "image/png" };
  }
  if (startsWith([0xff, 0xd8, 0xff])) {
    return { ext: "jpg", contentType: "image/jpeg" };
  }
  // "GIF8"
  if (startsWith([0x47, 0x49, 0x46, 0x38])) {
    return { ext: "gif", contentType: "image/gif" };
  }
  // "RIFF" .... "WEBP"
  if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)) {
    return { ext: "webp", contentType: "image/webp" };
  }
  return null;
}

// Hashing both sides gives timingSafeEqual the equal lengths it needs and
// keeps the comparison from leaking the token's length
function tokenMatches(given: string, expected: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(given), digest(expected));
}

// "My Graphic (final).PNG" -> "my-graphic-final"
function slugify(name: string): string {
  return name
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function POST(request: Request) {
  const expected = process.env.SOCIAL_UPLOAD_TOKEN;
  // Vercel names the connected store's token IMAGES_BLOB_READ_WRITE_TOKEN (the
  // store is linked with the IMAGES prefix) and keeps it current. The unprefixed
  // name is the fallback for local runs
  const blobToken = process.env.IMAGES_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  if (!expected || !blobToken) {
    return NextResponse.json({ error: "Social upload not configured" }, { status: 503 });
  }

  const given = request.headers.get("x-upload-token");
  if (!given || !tokenMatches(given, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tooLarge = NextResponse.json({ error: "Image must be 4 MB or smaller" }, { status: 413 });
  if (Number(request.headers.get("content-length")) > MAX_BYTES) return tooLarge;

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.byteLength > MAX_BYTES) return tooLarge;

  const type = detectImageType(bytes);
  if (!type) {
    return NextResponse.json(
      { error: "Body must be a PNG, JPEG, GIF or WebP image" },
      { status: 415 }
    );
  }

  const name = slugify(new URL(request.url).searchParams.get("name") ?? "") || "graphic";
  const date = new Date().toISOString().slice(0, 10);

  try {
    // The random suffix means an upload can never overwrite an image an
    // already-scheduled post points at
    const blob = await put(`social/${date}-${name}.${type.ext}`, Buffer.from(bytes), {
      access: "public",
      contentType: type.contentType,
      addRandomSuffix: true,
      token: blobToken,
    });
    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: type.contentType,
      size: bytes.byteLength,
    });
  } catch (err) {
    console.error("Social upload failed:", err);
    return NextResponse.json({ error: "Upload to Blob storage failed" }, { status: 502 });
  }
}
