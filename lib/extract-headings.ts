export interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

/**
 * Slugifies a heading text to match the IDs produced by rehype-slug + github-slugger.
 * Algorithm: lowercase → remove non-word/non-space/non-hyphen chars → collapse spaces → replace spaces with hyphens.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/** Tracks duplicate headings so their slugs get a numeric suffix, matching github-slugger behavior. */
function makeSlugger() {
  const seen: Record<string, number> = Object.create(null);
  return (text: string) => {
    const base = slugify(text);
    if (!(base in seen)) {
      seen[base] = 0;
      return base;
    }
    seen[base]++;
    return `${base}-${seen[base]}`;
  };
}

/**
 * Extracts h2 and h3 headings from raw MDX/markdown content.
 * Produces IDs that match rehype-slug so anchor links work correctly.
 */
export function extractHeadings(content: string): Heading[] {
  const slug = makeSlugger();
  const headings: Heading[] = [];

  // Skip fenced code blocks before matching headings
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(withoutCodeBlocks)) !== null) {
    const level = match[1].length as 2 | 3;
    // Strip inline markdown (bold, italic, code, links)
    const text = match[2]
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .trim();

    headings.push({ level, text, id: slug(text) });
  }

  return headings;
}
