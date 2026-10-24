import { put } from "@vercel/blob";

const images = [
  {
    slug: "a-vegas-tale-2",
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=630&fit=crop",
    ext: "jpg",
  },
  {
    slug: "designhackathon-the-meggs-case",
    url: "https://static1.squarespace.com/static/57752b91c534a5929ff9177d/t/57894c6920099eb5a807d43b/1468615801024/?format=1500w",
    ext: "jpg",
  },
  {
    slug: "girl-develop-it-2",
    url: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_650,q_auto:good,w_2560/v1/gcs/platform-data-girldevelopit/contentbuilder/Chapters%20banner.jpg",
    ext: "jpg",
  },
  {
    slug: "giving-back-2",
    url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=630&fit=crop",
    ext: "jpg",
  },
  {
    slug: "onward-maintainer-framework",
    url: "https://images.ctfassets.net/s5uo95nf6njh/4wequmilcloAAYh7V9Alb0/be2f102b77927ae1aa0e89f8d930347c/Culture__2_.jpg",
    ext: "jpg",
  },
  {
    slug: "oss",
    url: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&h=630&fit=crop",
    ext: "jpg",
  },
  {
    slug: "panel-discussion-how-to-be-a-good-ally-in-the-workspace",
    url: "https://img.youtube.com/vi/XLnSLRxDJ7I/maxresdefault.jpg",
    ext: "jpg",
  },
  {
    slug: "strange-loop",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630&fit=crop",
    ext: "jpg",
  },
  {
    slug: "undergrad-a-i-internships",
    url: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop",
    ext: "jpg",
  },
  {
    slug: "what-i-use",
    url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&h=630&fit=crop",
    ext: "jpg",
  },
];

for (const { slug, url, ext } of images) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch ${slug}: ${res.status} ${url}`);
      continue;
    }
    const buffer = await res.arrayBuffer();
    const blob = await put(`blog/${slug}.${ext}`, Buffer.from(buffer), {
      access: "public",
      contentType: "image/jpeg",
    });
    console.log(`Uploaded ${slug}: ${blob.url}`);
  } catch (err) {
    console.error(`Error uploading ${slug}:`, err);
  }
}
