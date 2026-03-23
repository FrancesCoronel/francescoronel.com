# francescoronel.com 🌐

My personal website, fully self-owned and prompt-driven. Migrated from Webflow to a Next.js stack with MDX content, static search, and zero vendor lock-in.

**Live:** [francescoronel.com](https://francescoronel.com) · **Hosted on:** Vercel · **Project Board:** [GitHub Projects](https://github.com/users/FrancesCoronel/projects/3/)

---

## Tech Stack 🛠️

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS 4 + `@tailwindcss/typography` |
| Content | MDX blog posts + JSON data files |
| MDX | `next-mdx-remote/rsc` with remark-gfm, rehype-slug, rehype-autolink-headings, rehype-pretty-code |
| Search | Pagefind (static index, zero client payload) |
| Images | Vercel Blob |
| Analytics | Vercel Analytics + Speed Insights + Google Analytics 4 |
| Hosting | Vercel Pro |
| Fonts | Cabin via `next/font/google` |

## Commands 💻

```bash
npm run dev              # start dev server
npm run build            # build + pagefind index (postbuild)
npm run start            # serve production build
npm run lint             # eslint
npm run lighthouse       # run lighthouse CI
npm run lighthouse:local # single-page lighthouse report (HTML output)
npm run audit:a11y       # pa11y-ci accessibility audit
npm run audit:full       # unlighthouse full-site audit
npm run storybook        # launch Storybook dev server (port 6006)
npm run build-storybook  # build static Storybook
npm run chromatic        # upload to Chromatic for visual regression
```

## Architecture 🏗️

- **665+ blog posts** as individual MDX files in `content/blog/`
- **Structured data** in JSON files: testimonials, organizations, skills, awards, experience, education
- Everything loaded at build time via `lib/content.ts` — synchronous file reads, no database
- **Search:** Pagefind indexes all rendered HTML pages at build time
- **Organizations** are the hub entity — each org page aggregates experience, posts, testimonials, education, awards
- See [`CLAUDE.md`](./CLAUDE.md) for full architecture docs

## Environment Variables 🔑

Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_GA4_MEASUREMENT_ID=   # Google Analytics 4
CAL_COM_API_KEY=                  # Cal.com mentoring sessions
BUTTONDOWN_API_KEY=               # Newsletter (Buttondown)
BLOB_READ_WRITE_TOKEN=            # Vercel Blob storage
```
