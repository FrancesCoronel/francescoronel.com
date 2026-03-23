# francescoronel.com 🌐

My personal website — migrated from Webflow to a fully self-owned Next.js stack.

No more vendor lock-in, full data ownership, prompt-driven editing ⚡

**Live:** [francescoronel.com](https://francescoronel.com) · **Hosted on:** Vercel · **Repo:** [FrancesCoronel/francescoronel.com](https://github.com/FrancesCoronel/francescoronel.com) · **Project Board:** [GitHub Projects](https://github.com/users/FrancesCoronel/projects/3/)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS 4 + `@tailwindcss/typography` |
| Content | MDX blog posts + JSON data files |
| MDX | `next-mdx-remote/rsc` with remark-gfm, rehype-slug, rehype-autolink-headings, rehype-pretty-code |
| Search | Pagefind (static binary search, zero client payload) |
| Images | Webflow CDN (current), planned migration to Cloudflare R2 |
| Analytics | Vercel Analytics + Speed Insights + Google Analytics 4 |
| Hosting | Vercel |
| Fonts | Cabin via `next/font/google` |

## Commands

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

## Architecture

- **665+ blog posts** as individual MDX files in `content/blog/`
- **Structured data** in JSON files: testimonials, organizations, skills, awards, experience, education
- Everything loaded at build time via `lib/content.ts` — synchronous file reads, no database
- **Search:** Pagefind indexes all rendered HTML pages at build time
- **Organizations** are the hub entity — each org page aggregates experience, posts, testimonials, education, awards
- See [`CLAUDE.md`](./CLAUDE.md) for full architecture docs

---

## Roadmap / Future Ideas

### Infrastructure & Deployment
- [ ] Migrate images from Webflow CDN to Cloudflare R2 or Cloudinary
- [ ] Add Lighthouse CI to GitHub Actions for automated performance monitoring
- [ ] Add visual regression testing (Playwright screenshots)
- [ ] Storybook deployment to public URL (Chromatic or Vercel)

### AI & Search
- [ ] Build RAG chatbot with Pagefind + Claude Haiku — conversational search over all site content
- [ ] Add AI-powered "related posts" recommendations beyond simple category matching

### Content & SEO
- [ ] Add Substack link / newsletter signup
- [ ] RSS to social auto-posting (Twitter/LinkedIn)
- [ ] Add reading progress bar to blog posts
- [ ] Add table of contents sidebar for long blog posts
- [ ] Migrate remaining WordPress images from CDN to local `/images/blog/`
- [ ] Download and self-host Imgur images referenced in older posts

### Speaking Page
- [ ] Add "Upcoming Events" section with future talk dates/locations
- [ ] Create speaker kit / press page with downloadable headshots, bio, one-sheet PDF
- [ ] Add topic tags to featured talks (AI, TypeScript, Diversity, etc.)

### Design & UX
- [ ] Add page transition animations (View Transitions API)
- [ ] Add skeleton loading states for dynamic content
- [ ] Add "back to top" floating button on long pages

### Analytics
- [ ] Add event tracking for CTA clicks, search queries, theme toggles
- [ ] Heatmap integration (PostHog or similar)
