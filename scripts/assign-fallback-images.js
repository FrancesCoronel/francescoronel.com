#!/usr/bin/env node

/**
 * Assigns fallback featured images to blog posts that have none.
 * Strategy:
 * 1. Education posts → use institution logo from organizations.json
 * 2. Experience posts → use company logo from experience.json
 * 3. Awards posts → use awarding org logo from organizations.json
 * 4. Programs posts → use org logo from organizations.json
 * 5. Press posts → category fallback
 * 6. Mentoring/people posts → category fallback
 * 7. All others → category-based fallback image
 *
 * Usage: node scripts/assign-fallback-images.js [--fix]
 */

const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "..", "content");
const blogDir = path.join(contentDir, "blog");

// Load data
const orgs = JSON.parse(
  fs.readFileSync(path.join(contentDir, "organizations.json"), "utf8")
);
const experiences = JSON.parse(
  fs.readFileSync(path.join(contentDir, "experience.json"), "utf8")
);
const education = JSON.parse(
  fs.readFileSync(path.join(contentDir, "education.json"), "utf8")
);

// Build lookup maps
const orgBySlug = {};
const orgByName = {};
for (const o of orgs) {
  orgBySlug[o.slug] = o;
  orgByName[o.name.toLowerCase()] = o;
}

const expBySlug = {};
for (const e of experiences) {
  expBySlug[e.slug] = e;
}

const eduBySlug = {};
for (const e of education) {
  eduBySlug[e.slug] = e;
}

// Category fallback images
const categoryImages = {
  education: "/images/categories/education.png",
  blog: "/images/categories/blog.png",
  mentoring: "/images/categories/mentoring.png",
  awards: "/images/categories/awards.png",
  portfolio: "/images/categories/portfolio.png",
  speaking: "/images/categories/speaking.png",
  press: "/images/categories/press.png",
  events: "/images/categories/events.png",
  experience: "/images/categories/experience.png",
  programs: "/images/categories/programs.png",
};

// Check which category images actually exist
const publicDir = path.join(__dirname, "..", "public");
const existingCatImages = {};
for (const [cat, imgPath] of Object.entries(categoryImages)) {
  const fullPath = path.join(publicDir, imgPath);
  existingCatImages[cat] = fs.existsSync(fullPath);
}

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
let assigned = 0;
let skipped = 0;
const results = [];

for (const f of files) {
  const filePath = path.join(blogDir, f);
  const content = fs.readFileSync(filePath, "utf8");
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;

  const imgMatch = fm[1].match(/^featuredImage:\s*"(.*?)"/m);
  const img = imgMatch ? imgMatch[1].trim() : "";
  if (img) continue; // already has featured image

  const slug = f.replace(".mdx", "");
  const titleMatch = fm[1].match(/^title:\s*"(.*?)"/m);
  const title = titleMatch ? titleMatch[1] : f;
  const catMatch = fm[1].match(/^categories:\s*\[(.*?)\]/m);
  const cats = catMatch
    ? catMatch[1]
        .split(",")
        .map((s) => s.trim().replace(/"/g, ""))
        .filter(Boolean)
    : [];
  const orgMatch = fm[1].match(/^organizations:\s*\[(.*?)\]/m);
  const postOrgs = orgMatch
    ? orgMatch[1]
        .split(",")
        .map((s) => s.trim().replace(/"/g, ""))
        .filter(Boolean)
    : [];

  let fallbackImage = "";
  let source = "";

  // Strategy 1: Education posts - use institution logo
  if (cats.includes("education")) {
    // Try to find matching education entry or org
    for (const orgSlug of postOrgs) {
      const org = orgBySlug[orgSlug];
      if (org && org.logo) {
        fallbackImage = org.logo;
        source = `org logo: ${org.name}`;
        break;
      }
    }
    // Also check education entries by slug similarity
    if (!fallbackImage) {
      for (const edu of education) {
        if (
          slug.includes(edu.slug) ||
          edu.slug.includes(slug) ||
          title.toLowerCase().includes(edu.institution.toLowerCase())
        ) {
          if (edu.logo) {
            fallbackImage = edu.logo;
            source = `edu logo: ${edu.institution}`;
            break;
          }
        }
      }
    }
  }

  // Strategy 2: Experience posts - use company logo
  if (!fallbackImage && cats.includes("experience")) {
    for (const exp of experiences) {
      if (
        slug.includes(exp.slug) ||
        exp.slug.includes(slug) ||
        title.toLowerCase().includes(exp.company.toLowerCase())
      ) {
        if (exp.companyLogo) {
          fallbackImage = exp.companyLogo;
          source = `exp logo: ${exp.company}`;
          break;
        }
      }
    }
    // Try org logos
    if (!fallbackImage) {
      for (const orgSlug of postOrgs) {
        const org = orgBySlug[orgSlug];
        if (org && org.logo) {
          fallbackImage = org.logo;
          source = `org logo: ${org.name}`;
          break;
        }
      }
    }
  }

  // Strategy 3: Awards posts - use org logo
  if (!fallbackImage && cats.includes("awards")) {
    for (const orgSlug of postOrgs) {
      const org = orgBySlug[orgSlug];
      if (org && org.logo) {
        fallbackImage = org.logo;
        source = `org logo: ${org.name}`;
        break;
      }
    }
  }

  // Strategy 4: Programs posts - use org logo
  if (!fallbackImage && cats.includes("programs")) {
    for (const orgSlug of postOrgs) {
      const org = orgBySlug[orgSlug];
      if (org && org.logo) {
        fallbackImage = org.logo;
        source = `org logo: ${org.name}`;
        break;
      }
    }
  }

  // Strategy 5: Portfolio posts - use org logo
  if (!fallbackImage && cats.includes("portfolio")) {
    for (const orgSlug of postOrgs) {
      const org = orgBySlug[orgSlug];
      if (org && org.logo) {
        fallbackImage = org.logo;
        source = `org logo: ${org.name}`;
        break;
      }
    }
  }

  // Strategy 6: Any post with org references - try org logo
  if (!fallbackImage && postOrgs.length > 0) {
    for (const orgSlug of postOrgs) {
      const org = orgBySlug[orgSlug];
      if (org && org.logo) {
        fallbackImage = org.logo;
        source = `org logo: ${org.name}`;
        break;
      }
    }
  }

  // Strategy 7: Category-based fallback
  if (!fallbackImage) {
    const primaryCat = cats[0] || "blog";
    const catImgPath = categoryImages[primaryCat];
    if (catImgPath && existingCatImages[primaryCat]) {
      fallbackImage = catImgPath;
      source = `category: ${primaryCat}`;
    } else if (existingCatImages["blog"]) {
      fallbackImage = categoryImages["blog"];
      source = "category: blog (default)";
    }
  }

  if (fallbackImage) {
    assigned++;
    results.push({ slug, title, cats, image: fallbackImage, source });

    if (process.argv.includes("--fix")) {
      let updatedContent;
      if (imgMatch) {
        // Replace empty featuredImage
        updatedContent = content.replace(
          /^(featuredImage:\s*)""/m,
          `$1"${fallbackImage}"`
        );
      } else {
        // Add featuredImage to frontmatter
        const frontmatter = fm[1];
        const updatedFrontmatter =
          frontmatter + `\nfeaturedImage: "${fallbackImage}"`;
        updatedContent = content.replace(
          `---\n${frontmatter}\n---`,
          `---\n${updatedFrontmatter}\n---`
        );
      }
      fs.writeFileSync(filePath, updatedContent);
    }
  } else {
    skipped++;
    results.push({
      slug,
      title,
      cats,
      image: null,
      source: "NO FALLBACK FOUND",
    });
  }
}

// Report
const fix = process.argv.includes("--fix");
console.log(`${fix ? "Assigned" : "Would assign"}: ${assigned}`);
console.log(`No fallback available: ${skipped}`);
console.log("");

// Group by source type
const bySource = {};
for (const r of results) {
  const key = r.source.split(":")[0] || "none";
  if (!bySource[key]) bySource[key] = [];
  bySource[key].push(r);
}

for (const [src, items] of Object.entries(bySource)) {
  console.log(`=== ${src.toUpperCase()} (${items.length}) ===`);
  for (const r of items) {
    console.log(`  ${r.slug}`);
    console.log(`    Title: ${r.title}`);
    console.log(`    Image: ${r.image || "NONE"}`);
    console.log(`    Source: ${r.source}`);
  }
  console.log("");
}

if (!fix) {
  console.log("Run with --fix to apply changes");
}
