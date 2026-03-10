import { type ClassValue, clsx } from "clsx";

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
  const date = new Date(dateStr);
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
