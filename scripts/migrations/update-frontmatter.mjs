import { readFileSync, writeFileSync } from "fs";

const BASE = "https://ktebrbhzg9wasky1.public.blob.vercel-storage.com/blog";

const updates = [
  ["a-vegas-tale-2", `${BASE}/a-vegas-tale-2.jpg`],
  ["girl-develop-it-2", `${BASE}/girl-develop-it-2.jpg`],
  ["giving-back-2", `${BASE}/giving-back-2.jpg`],
  ["onward-maintainer-framework", `${BASE}/onward-maintainer-framework.jpg`],
  ["oss", `${BASE}/oss.jpg`],
  ["panel-discussion-how-to-be-a-good-ally-in-the-workspace", `${BASE}/panel-discussion-how-to-be-a-good-ally-in-the-workspace.jpg`],
  ["strange-loop", `${BASE}/strange-loop.jpg`],
  ["undergrad-a-i-internships", `${BASE}/undergrad-a-i-internships.jpg`],
  ["what-i-use", `${BASE}/what-i-use.jpg`],
  ["designhackathon-the-meggs-case", `${BASE}/designhackathon-the-meggs-case.jpg`],
  // Duplicate WP posts — copy image from Webflow canonical
  ["im-obsessed-with-labs", `${BASE}/63b28f14abde4cac55b23473_Re1sr8U.png`],
  ["mindot-tour", `${BASE}/63b28f22b337a67f752e5163_aLDGZZj.jpeg`],
];

const dir = "/Users/francescoronel/Documents/GitHub/francescoronel.com/content/blog";

for (const [slug, url] of updates) {
  const file = `${dir}/${slug}.mdx`;
  try {
    let content = readFileSync(file, "utf8");
    content = content.replace(/featuredImage: ""/, `featuredImage: "${url}"`);
    writeFileSync(file, content);
    console.log(`Updated: ${slug}`);
  } catch (e) {
    console.error(`Error: ${slug}`, e.message);
  }
}

// Emoji-encoded filenames
const emojiFiles = [
  ["new-epoch-new-exploits-%f0%9f%98%88", `${BASE}/63b28efcb3e37531b452d6ed_T6hJOH1.jpeg`],
  ["smash-academy-at-stanford-%f0%9f%8e%93", `${BASE}/63b28f2334a33d0e40aa3d94_48vjaRy.jpeg`],
];
for (const [slug, url] of emojiFiles) {
  const file = `${dir}/${slug}.mdx`;
  try {
    let content = readFileSync(file, "utf8");
    content = content.replace(/featuredImage: ""/, `featuredImage: "${url}"`);
    writeFileSync(file, content);
    console.log(`Updated: ${slug}`);
  } catch (e) {
    console.error(`Error: ${slug}`, e.message);
  }
}
