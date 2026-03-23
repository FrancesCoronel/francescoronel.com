import { put } from "@vercel/blob";

const imageUrl = "https://slack.engineering/wp-content/uploads/sites/7/2026/03/Notifications-2.0-Project-Demo-1-1.png";

const res = await fetch(imageUrl);
if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
const buffer = await res.arrayBuffer();

const blob = await put("blog/how-slack-rebuilt-notifications.png", Buffer.from(buffer), {
  access: "public",
  contentType: "image/png",
});

console.log("Uploaded:", blob.url);
