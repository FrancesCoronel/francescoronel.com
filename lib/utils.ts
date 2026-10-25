import { type ClassValue, clsx } from "clsx";

// Hostnames configured in next.config.ts remotePatterns — keep in sync
export const OPTIMIZED_HOSTS = new Set([
  "cdn.prod.website-files.com",
  "uploads-ssl.webflow.com",
  "fvcproductions39789812.wordpress.com",
  "fvcproductions.files.wordpress.com",
  "i.stack.imgur.com",
  "cdn-images-1.medium.com",
  "images.pexels.com",
  "media.githubusercontent.com",
  "pbs.twimg.com",
  "i.ytimg.com",
  "github.com",
  "avatars.githubusercontent.com",
  "encrypted-tbn0.gstatic.com",
  "www.scdn.co",
  "www.themebeta.com",
  "tf-assets-prod.s3.amazonaws.com",
  "knightfoundation.imgix.net",
  "logo.clearbit.com",
  "raw.githubusercontent.com",
  "ph-files.imgix.net",
  "s3-us-west-2.amazonaws.com",
  "static1.squarespace.com",
  "www.apprenticeships.me",
  "www.engjobsearch.com",
  "ktebrbhzg9wasky1.public.blob.vercel-storage.com",
  // New Vercel Blob store (migrated 2025)
  "gzqhczl3ehdy3foa.public.blob.vercel-storage.com",
]);

export function canOptimize(url: string): boolean {
  // Local raster images in public/ go through next/image too (SVGs need dangerouslyAllowSVG, so they don't)
  if (/^\/(?!\/)[^?#]*\.(png|jpe?g|webp|avif)$/i.test(url)) return true;
  try {
    const { hostname } = new URL(url);
    return OPTIMIZED_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

/**
 * Merge Tailwind class names, resolving conflicts.
 * Lightweight alternative to tailwind-merge for simple cases.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr: string): string {
  // Append noon to avoid UTC midnight shifting the date back one day in western timezones
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date range (e.g., "Jan 2022 – Present").
 */
export function formatDateRange(start: string, end: string | null): string {
  const startDate = new Date(start);
  const startStr = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  if (!end) return `${startStr} – Present`;

  const endDate = new Date(end);
  const endStr = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  return `${startStr} – ${endStr}`;
}

/**
 * Truncate a string to a maximum length, adding ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "...";
}

/**
 * Slugify a string (for generating URL-safe slugs).
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Words that plain title casing gets wrong (acronyms and brand names), keyed by lowercase slug word
export const LABEL_OVERRIDES: Record<string, string> = {
  ai: "AI",
  api: "API",
  apis: "APIs",
  aws: "AWS",
  cli: "CLI",
  css: "CSS",
  erg: "ERG",
  github: "GitHub",
  gitlab: "GitLab",
  graphql: "GraphQL",
  html: "HTML",
  https: "HTTPS",
  ios: "iOS",
  javascript: "JavaScript",
  json: "JSON",
  linkedin: "LinkedIn",
  llm: "LLM",
  llms: "LLMs",
  macos: "macOS",
  mdx: "MDX",
  nextjs: "Next.js",
  nodejs: "Node.js",
  npm: "npm",
  openai: "OpenAI",
  php: "PHP",
  qa: "QA",
  sdk: "SDK",
  seo: "SEO",
  sql: "SQL",
  stem: "STEM",
  typescript: "TypeScript",
  ui: "UI",
  url: "URL",
  ux: "UX",
  wordpress: "WordPress",
  youtube: "YouTube",
};

// Short words kept lowercase unless they start the label
const MINOR_WORDS = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to", "vs"]);

/**
 * Turn a slug like "ai-agents" into a display label like "AI Agents",
 * respecting LABEL_OVERRIDES for acronyms and brand names.
 */
export function formatSlugLabel(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (LABEL_OVERRIDES[lower]) return LABEL_OVERRIDES[lower];
      if (i > 0 && MINOR_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}
