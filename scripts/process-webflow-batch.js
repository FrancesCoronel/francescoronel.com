// Processes a Webflow blog post batch JSON file and writes MDX files
// Usage: node scripts/process-webflow-batch.js <batch-file-path>

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const refMaps = JSON.parse(fs.readFileSync('/tmp/webflow-ref-maps.json', 'utf-8'));

function resolveRefs(ids, map) {
  if (!ids || !map) return [];
  return ids.map(id => map[id]).filter(Boolean);
}

function htmlToMdx(html) {
  if (!html) return '';
  let mdx = html;

  // Remove Webflow IDs and classes
  mdx = mdx.replace(/\s+id="[^"]*"/g, '');
  mdx = mdx.replace(/\s+class="[^"]*"/g, '');
  mdx = mdx.replace(/\s+data-[a-z-]+="[^"]*"/g, '');

  // Headings
  mdx = mdx.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  mdx = mdx.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  mdx = mdx.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  mdx = mdx.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');
  mdx = mdx.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n');
  mdx = mdx.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n');

  // Paragraphs
  mdx = mdx.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');

  // Bold, italic
  mdx = mdx.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  mdx = mdx.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  mdx = mdx.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  mdx = mdx.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');

  // Links
  mdx = mdx.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Images
  mdx = mdx.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  mdx = mdx.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Figure
  mdx = mdx.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, '$1');
  mdx = mdx.replace(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi, '\n*$1*\n');

  // Lists
  mdx = mdx.replace(/<ul[^>]*>/gi, '\n');
  mdx = mdx.replace(/<\/ul>/gi, '\n');
  mdx = mdx.replace(/<ol[^>]*>/gi, '\n');
  mdx = mdx.replace(/<\/ol>/gi, '\n');
  mdx = mdx.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1');

  // Blockquotes
  mdx = mdx.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '> $1');

  // Code
  mdx = mdx.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n');
  mdx = mdx.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

  // Line breaks, hr
  mdx = mdx.replace(/<br\s*\/?>/gi, '\n');
  mdx = mdx.replace(/<hr\s*\/?>/gi, '\n---\n');

  // Strip remaining tags
  mdx = mdx.replace(/<\/?[^>]+(>|$)/g, '');

  // Decode entities
  mdx = mdx.replace(/&amp;/g, '&');
  mdx = mdx.replace(/&lt;/g, '<');
  mdx = mdx.replace(/&gt;/g, '>');
  mdx = mdx.replace(/&quot;/g, '"');
  mdx = mdx.replace(/&#39;/g, "'");
  mdx = mdx.replace(/&nbsp;/g, ' ');

  // Clean whitespace
  mdx = mdx.replace(/\n{3,}/g, '\n\n');
  return mdx.trim();
}

// Main
const batchFile = process.argv[2];
if (!batchFile) {
  console.error('Usage: node scripts/process-webflow-batch.js <batch-file>');
  process.exit(1);
}

const raw = require(batchFile);
const result = JSON.parse(raw[0].text);
const items = result.items;

fs.mkdirSync(BLOG_DIR, { recursive: true });

let written = 0;
for (const post of items) {
  const fd = post.fieldData;
  const slug = fd.slug || '';
  if (!slug) continue;

  const title = (fd.name || '').replace(/"/g, '\\"');
  const date = fd.published || post.createdOn || '';
  const excerpt = (fd['blog-post-excerpt'] || '').replace(/"/g, '\\"');
  const featuredImage = fd['blog-post-featured-image-photo']?.url || '';
  const body = fd['blog-post-richt-text'] || '';
  const externalUrl = fd.url || '';

  const categories = resolveRefs(fd.category, refMaps.catMap);
  const tags = resolveRefs(fd.tags, refMaps.tagMap);
  const organizations = resolveRefs(fd.organization, refMaps.orgMap);
  const skills = resolveRefs(fd['job-or-project-skills'], refMaps.skillMap);

  const lines = [
    '---',
    `title: "${title}"`,
    `slug: "${slug}"`,
    `date: "${date ? new Date(date).toISOString().split('T')[0] : ''}"`,
    `excerpt: "${excerpt}"`,
    `featuredImage: "${featuredImage}"`,
    `categories: ${JSON.stringify(categories)}`,
    `tags: ${JSON.stringify(tags)}`,
    `organizations: ${JSON.stringify(organizations)}`,
    `skills: ${JSON.stringify(skills)}`,
  ];
  if (externalUrl) lines.push(`externalUrl: "${externalUrl}"`);
  lines.push('source: "webflow"');
  lines.push('---');

  const mdxContent = htmlToMdx(body);
  const fileContent = lines.join('\n') + '\n\n' + mdxContent + '\n';

  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), fileContent, 'utf-8');
  written++;
}

console.log(`Processed ${written} blog posts from batch`);
