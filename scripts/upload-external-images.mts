import { put } from "@vercel/blob";

const images = [
  { slug: "accenture-training", url: "https://i.imgur.com/rvTmpm9.jpg", ext: "jpg" },
  { slug: "apm-programs", url: "https://i.imgur.com/llTkGsA.jpg", ext: "jpg" },
  { slug: "cra-women-workshop", url: "https://i.imgur.com/CNWC9Aj.png", ext: "png" },
  { slug: "freecodecamp-guide", url: "https://i.imgur.com/pZij95O.jpg", ext: "jpg" },
  { slug: "fullstack-academy-alumni-spotlight", url: "https://i.imgur.com/KYkkchl.png", ext: "png" },
  { slug: "gcdp-program-fujistsu", url: "https://i.imgur.com/93HYvEM.jpg", ext: "jpg" },
  { slug: "hour-of-code", url: "https://image.slidesharecdn.com/2016-12-06hourofcode-middleschool-171116001425/95/hour-of-code-2016-middle-school-1-638.jpg?cb=1510971722", ext: "jpg" },
  { slug: "macos-apps", url: "https://i.imgur.com/llTkGsA.jpg", ext: "jpg" },
  { slug: "maury-op-smile", url: "https://i.imgur.com/coRiWRv.jpg", ext: "jpg" },
];

for (const { slug, url, ext } of images) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch ${slug}: ${res.status}`);
      continue;
    }
    const buffer = await res.arrayBuffer();
    const contentType = ext === "png" ? "image/png" : "image/jpeg";
    const blob = await put(`blog/${slug}.${ext}`, Buffer.from(buffer), {
      access: "public",
      contentType,
    });
    console.log(`Uploaded ${slug}: ${blob.url}`);
  } catch (err) {
    console.error(`Error uploading ${slug}:`, err);
  }
}
