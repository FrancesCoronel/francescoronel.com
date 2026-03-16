import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  BlogPost,
  BlogPostFrontmatter,
  Testimonial,
  Organization,
  Skill,
  Award,
  WorkExperience,
  Education,
  Category,
  Tag,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");

// ─── Blog Posts ──────────────────────────────────────────────

export function getBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as BlogPostFrontmatter;
  const stats = readingTime(content);

  return {
    slug: frontmatter.slug || slug,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt || "",
    featuredImage: frontmatter.featuredImage || "",
    categories: frontmatter.categories || [],
    tags: frontmatter.tags || [],
    organizations: frontmatter.organizations || [],
    skills: frontmatter.skills || [],
    externalUrl: frontmatter.externalUrl,
    source: frontmatter.source,
    readingTime: stats.text,
    content,
  };
}

export function getAllBlogPosts(): BlogPost[] {
  const slugs = getBlogSlugs();
  const posts = slugs
    .map((slug) => getBlogPost(slug))
    .filter((post): post is BlogPost => post !== null);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPostsByCategory(categorySlug: string): BlogPost[] {
  if (categorySlug === "uncategorized") {
    return getAllBlogPosts().filter((post) => post.categories.length === 0);
  }
  return getAllBlogPosts().filter((post) =>
    post.categories.includes(categorySlug)
  );
}

export function getBlogPostsByTag(tagSlug: string): BlogPost[] {
  return getAllBlogPosts().filter((post) => post.tags.includes(tagSlug));
}

// ─── JSON Data Loaders ───────────────────────────────────────

function loadJSON<T>(filename: string): T[] {
  const filePath = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

export function getTestimonials(): Testimonial[] {
  return loadJSON<Testimonial>("testimonials.json");
}

export function getOrganizations(): Organization[] {
  return loadJSON<Organization>("organizations.json");
}

export function getSkills(): Skill[] {
  return loadJSON<Skill>("skills.json");
}

export function getAwards(): Award[] {
  return loadJSON<Award>("awards.json").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getExperiences(): WorkExperience[] {
  return loadJSON<WorkExperience>("experience.json").sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

export function getEducation(): Education[] {
  return loadJSON<Education>("education.json").sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

export function getCategories(): Category[] {
  const categories = loadJSON<Category>("categories.json");
  const posts = getAllBlogPosts();
  const withCounts = categories.map((cat) => ({
    ...cat,
    count: posts.filter((p) => p.categories.includes(cat.slug)).length,
  }));
  const uncategorizedCount = posts.filter((p) => p.categories.length === 0).length;
  withCounts.push({
    name: "Uncategorized",
    slug: "uncategorized",
    color: "#888888",
    fontColor: "#ffffff",
    emoji: "📁",
    image: "",
    description: "Posts without a category.",
    count: uncategorizedCount,
  });
  return withCounts;
}

export function getCategoryMaps() {
  const categories = getCategories();
  const categoryImages: Record<string, string> = {};
  for (const cat of categories) {
    if (cat.image) categoryImages[cat.slug] = cat.image;
  }
  return { categoryImages };
}

export function getTags(): Tag[] {
  const tags = loadJSON<Tag>("tags.json");
  const posts = getAllBlogPosts();
  return tags.map((tag) => ({
    ...tag,
    count: posts.filter((p) => p.tags.includes(tag.slug)).length,
  }));
}

/** Organizations excluded from featured/preview sections (still exist for detail pages) */
export const EXCLUDED_FROM_FEATURED_ORGS = new Set([
  "accenture",
  "byteboard",
  "jupiterone",
]);

/** Get organizations sorted by number of blog post references (most active first) */
export function getOrganizationsByActivity(): Organization[] {
  const orgs = getOrganizations();
  const posts = getAllBlogPosts();
  const countMap: Record<string, number> = {};
  for (const org of orgs) {
    countMap[org.slug] = posts.filter(
      (p) => p.organizations && p.organizations.includes(org.slug)
    ).length;
  }
  return [...orgs].sort((a, b) => (countMap[b.slug] || 0) - (countMap[a.slug] || 0));
}

// ─── Lookup helpers ──────────────────────────────────────────

export function getExperienceBySlug(slug: string): WorkExperience | undefined {
  return getExperiences().find((e) => e.slug === slug);
}

export function getEducationBySlug(slug: string): Education | undefined {
  return getEducation().find((e) => e.slug === slug);
}

export function getAwardBySlug(slug: string): Award | undefined {
  return getAwards().find((a) => a.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getTagBySlug(slug: string): Tag | undefined {
  return getTags().find((t) => t.slug === slug);
}

export function getTestimonialBySlug(
  slug: string,
): Testimonial | undefined {
  return getTestimonials().find((t) => t.slug === slug);
}

export function getOrganizationBySlug(slug: string): Organization | undefined {
  return getOrganizations().find((o) => o.slug === slug);
}

export function getOrganizationByName(name: string): Organization | undefined {
  const lower = name.toLowerCase();
  return getOrganizations().find((o) => o.name.toLowerCase() === lower);
}

/**
 * Returns all content associated with a given organization slug.
 * Matches by: slug in blog post frontmatter, name in experience/testimonial data.
 */
export function getContentByOrganization(orgSlug: string) {
  const org = getOrganizationBySlug(orgSlug);
  if (!org) return null;

  const orgName = org.name.toLowerCase();

  const posts = getAllBlogPosts().filter((p) =>
    p.organizations.some((o) => o.toLowerCase() === orgSlug)
  );

  const experiences = getExperiences().filter(
    (e) => e.company.toLowerCase() === orgName
  );

  const testimonials = getTestimonials().filter(
    (t) => t.organization.toLowerCase() === orgName
  );

  const awards = getAwards().filter(
    (a) => a.organization.toLowerCase() === orgName
  );

  const education = getEducation().filter(
    (e) => e.institution.toLowerCase() === orgName
  );

  return { org, posts, experiences, testimonials, awards, education };
}
