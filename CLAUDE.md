# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# francescoronel.com 🌐

My personal website — migrated from Webflow to a fully self-owned Next.js stack

No more vendor lock-in, full data ownership, prompt-driven editing ⚡

## Tech Stack 🛠️

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS 4 + `@tailwindcss/typography` |
| Content | MDX blog posts + JSON data files |
| MDX | `next-mdx-remote/rsc` with remark-gfm, rehype-slug, rehype-autolink-headings, rehype-pretty-code |
| Search | Pagefind (static binary search index, zero client payload) |
| Images | Webflow CDN (current), planned migration to Cloudflare R2 |
| Analytics | Vercel Analytics + Speed Insights + Google Analytics 4 |
| Hosting | Vercel |
| Fonts | Cabin (placeholder for Latina Essential) via `next/font/google` |
| Perf/A11y | Lighthouse CI in GitHub Actions, pa11y-ci for WCAG2AA |

## Architecture 🏗️

### Content System 📝

- **665 blog posts** as individual MDX files in `content/blog/`
- Each has YAML frontmatter — title, date, excerpt, featuredImage, categories, tags, organizations, skills, source
- **Structured data** in JSON files: testimonials, organizations, skills, awards, experience, education, categories, tags
- Everything loaded at build time via `lib/content.ts` — synchronous file reads, no database

### Content Sources 📚

Posts consolidated from 5 platform eras:
- **Webflow** (primary, highest priority in dedup)
- **WordPress**
- **Hugo v3, v2, v1** (Jekyll)

Dedup script (`scripts/dedup-posts.js`) keeps the Webflow version when duplicates exist and generates redirect entries in `scripts/dedup-redirects.json`

### Routing 🗺️

- **Static pages**: `/`, `/about`, `/blog`, `/contact`, `/speaking`, `/mentoring`, `/portfolio`, `/testimonials`, `/organizations`, `/for-llms`, `/tags`, `/experience`, `/education`, `/design-system`
- **Dynamic SSG**: `/blog/[slug]`, `/categories/[slug]`, `/tags/[slug]`, `/experience/[slug]`, `/education/[slug]`, `/awards/[slug]`, `/organizations/[slug]`, `/testimonials/[slug]`
- **API routes**: `/feed` (RSS), `/robots.txt`, `/sitemap.xml`

### Cross-Linking 🔗

Organizations are the **hub entity** — each org page (`/organizations/[slug]`) aggregates:
- Work experience (matched by company name)
- Blog posts (matched by org slug in frontmatter)
- Testimonials (matched by organization name)
- Education (matched by institution name)
- Awards (matched by organization name)

Experience and education detail pages link back to their org page — the About page timeline links to both detail pages and org pages

### Search 🔍

Pagefind indexes all 787+ rendered HTML pages at build time — the search component (`components/ui/pagefind-search.tsx`) lazy-loads Pagefind JS (~10KB) on first focus and fetches small index chunks per query

Zero client-side content payload — works great even on 3G

### Image Handling 🖼️

- `next/image` for hosts in `remotePatterns` (Webflow CDN, WordPress, Imgur, GitHub, etc.)
- Fallback `<img>` tag for unrecognized hosts
- `lib/cloudinary.ts` has URL helpers for future Cloudflare R2 migration
- `components/mdx/mdx-components.tsx` has the `OPTIMIZED_HOSTS` set — must match `next.config.ts` remotePatterns

### MDX Sanitization 🧹

`lib/sanitize-mdx.ts` escapes bare `<` characters outside code blocks/inline code to prevent JSX parse errors — blog post rendering has a try/catch fallback to raw text if MDX compilation fails

### Redirects ↩️

`next.config.ts` has comprehensive redirects covering:
- Webflow CMS template URLs (`/detail_blog/`, `/detail_testimonials/`, etc.)
- Hugo date-based permalinks (`/:year/:month/:day/:slug`)
- Hugo content directories (`/posts/`, `/adventures/`)
- WordPress URL patterns
- Trailing slash normalization
- RSS feed aliases, old page paths
- 242 dedup redirects from `scripts/dedup-redirects.json`

### SEO & AI Discoverability 🤖

- `generateMetadata()` on every page
- JSON-LD: Person (with employer, alumni, knowsAbout), WebSite, BlogPosting, BreadcrumbList
- `/llms.txt` — structured text for AI agents
- `/for-llms` — LLM-readable page with full bio, experience, skills, posts
- `robots.ts` explicitly allows GPTBot, ChatGPT-User, Claude-Web, PerplexityBot, anthropic-ai

## Key Files 📁

| File | Purpose |
|---|---|
| `lib/content.ts` | All content loading functions (blog posts, JSON data, cross-references) |
| `lib/metadata.ts` | Site config, `buildMetadata()` helper |
| `lib/sanitize-mdx.ts` | Escapes `<` in MDX content |
| `lib/cloudinary.ts` | Image URL resolution and Cloudinary helpers |
| `components/mdx/mdx-components.tsx` | Custom MDX components (images, links, callouts) |
| `components/ui/pagefind-search.tsx` | Pagefind search component (lazy-loaded) |
| `next.config.ts` | Image remote patterns, redirects |
| `app/globals.css` | Tailwind v4 theme tokens (colors, fonts, spacing) |
| `lighthouserc.json` | Lighthouse CI thresholds (90+ perf/a11y/best-practices, 95+ SEO) |

## Commands 💻

```bash
npm run dev              # start dev server
npm run build            # build + pagefind index (postbuild)
npm run start            # serve production build
npm run lint             # eslint
npm run lighthouse       # run lighthouse CI (uses lighthouserc.json)
npm run lighthouse:local # single-page lighthouse report (HTML output)
npm run audit:a11y       # pa11y-ci accessibility audit
npm run audit:full       # unlighthouse full-site audit (crawls all pages)
npm run storybook        # launch Storybook dev server (port 6006)
npm run build-storybook  # build static Storybook
npm run test:storybook   # run Vitest component tests via addon-vitest
npm run chromatic        # upload to Chromatic for visual regression
```

## Custom Slash Commands 🔧

Defined in `.claude/commands/` — invoke with `/command-name`:

- `/new-post` — scaffold a new MDX blog post with frontmatter template
- `/deploy` — build + push to trigger Vercel deployment
- `/commit` — smart commit with conventional message
- `/audit` — run performance & accessibility audits

## Design Tokens 🎨

Colors follow a **navy + horchata** palette defined in `app/globals.css` under `@theme`:
- `navy-50` through `navy-950` — dark blues for text, backgrounds
- `horchata-50` through `horchata-950` — warm beige/tan for accents, highlights
- Accent: `horchata-400` (#e5b783)
- Light mode bg: `horchata-50` (#fdf8f3)
- Dark mode bg: `navy-900` (#141726)

## Image Hosting 🖼️

All new images must be uploaded to Vercel Blob storage before use. Never reference external image CDNs (AWS S3, Webflow CDN, imgix, etc.) directly.

**Store ID:** `store_kTEbrBhzG9WAskY1`
**Public base URL:** `https://ktebrbhzg9wasky1.public.blob.vercel-storage.com/`

**Upload a new image:**
```bash
BLOB_READ_WRITE_TOKEN="..." node -e "
const { put } = require('@vercel/blob');
const fs = require('fs');
async function main() {
  const buf = fs.readFileSync('/path/to/image.png');
  const blob = await put('folder/filename.png', buf, { access: 'public', contentType: 'image/png' });
  console.log(blob.url);
}
main();
"
```

Folder conventions:
- `speaking/` — speaking event photos
- `awards/` — award images
- `projects/` — project screenshots/logos
- `static/` — general site assets

## Emoji Skin Tone 🏽

Always use **medium-brown skin tone** (🏽, modifier U+1F3FD) for ANY emoji that supports a skin tone modifier. This includes ALL hand gestures, body parts, and person/people emoji. Never use default yellow/generic, light, medium-light, medium-dark, or dark skin tones.

**Applies to:** ✍🏽 👋🏽 🤝🏽 👊🏽 ✌🏽 💪🏽 👍🏽 👎🏽 👏🏽 🙌🏽 🙏🏽 💅🏽 ✋🏽 🤚🏽 🖐🏽 👌🏽 🤞🏽 🤟🏽 🤘🏽 🤙🏽 🫶🏽 🫱🏽 🫲🏽 👈🏽 👉🏽 👆🏽 👇🏽 ☝🏽 ✊🏽 🤜🏽 🤛🏽 👐🏽 🤲🏽 and all person/face emoji (👩🏽‍💻 👩🏽‍🏫 👩🏽‍💼 🧑🏽‍💻 etc.)

**Rule:** Before writing any emoji, check if it supports skin tone. If yes, always append 🏽. No exceptions.

## Conventions 📐

- All pages use `max-w-[var(--container-max)]` (1200px) with `px-6` padding
- Section headings use uppercase tracking-widest labels above the main heading
- Cards: `rounded-2xl border border-horchata-200 bg-white` (dark: `border-navy-700 bg-navy-800`)
- Links: `text-horchata-600 hover:text-horchata-800` styling
- Nav has active page detection via `usePathname()`
- Testimonial cards truncate to 280 chars with "Read more" expand/collapse
- Blog uses Pagefind for full-text search + client-side category filtering + pagination (18 per page)

## Section Header Format 🏷️

Every section must have BOTH a subheader label AND an emoji in the main heading. No exceptions.

```tsx
<p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
  Events                          {/* short category label, no emoji */}
</p>
<h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
  Speaking 🎤                     {/* heading + emoji */}
</h2>
```

- Subheader: short, uppercase, `text-horchata-700`, no emoji
- Main heading: title case, emoji at the end, `dark:text-horchata-100`
- Never use a heading without the subheader label above it

## Alternating Section Backgrounds 🎨

Pages must alternate between light and dark section backgrounds.

**Rules:**
- **Page headers** (PageHeader component or first hero section): always **light** bg
- **Footer CTA** (ConnectCTA component, last content section): always **dark** bg
- All sections in between alternate, starting with dark after the header

**Light sections**: `bg-white` or `bg-horchata-50 dark:bg-navy-900`

**Dark sections**: `border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950`

Pattern: PageHeader(light) → dark → light → dark → NewsletterCTA → ConnectCTA(dark) → Footer(nav, dark)

When adding a new section, check what the section before it is and apply the opposite bg. Use `sectionClassName` prop on shared components (like `TestimonialsPreview`) to override their default bg when needed.
