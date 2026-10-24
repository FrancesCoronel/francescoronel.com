---
name: audit
description: Run Lighthouse and axe accessibility audits against a local production build and compare them with the CI gate in .github/workflows/pr.yml. Use when asked to audit performance or accessibility, or before a layout or performance change.
argument-hint: "[url]"
---

# Performance and accessibility audit 🔍

Reproduce the CI `web-quality` gate locally and summarize the results.

## The CI gate

`.github/workflows/pr.yml` runs the shared `web-quality.yml` on the URLs listed there. Read that file for the current list and thresholds. Today it is:

- Zero axe-core violations (WCAG 2 AA)
- Lighthouse performance 0.85 or higher (`performance-min`)
- Lighthouse accessibility, best practices and SEO 1.0 (100)

`lighthouserc.json` (`npm run lighthouse`) uses looser thresholds and fewer URLs, so passing it doesn't mean CI passes. Judge results against `pr.yml`.

## What to do

1. Make sure a production server is on localhost:3000. If not, run `npm run build` then `npm run start`. Don't audit `npm run dev`; dev scores are meaningless.
2. For each URL in `pr.yml` (or only `$ARGUMENTS` if given), run Lighthouse:

   ```bash
   npx lighthouse http://localhost:3000/posts --output json --output-path .lighthouseci/posts.json --chrome-flags='--headless=new' --only-categories=performance,accessibility,best-practices,seo
   ```

3. Run axe on the same URLs:

   ```bash
   npx @axe-core/cli http://localhost:3000/ http://localhost:3000/posts --tags wcag2a,wcag2aa --exit
   ```

4. Summarize in a table:

   | Page | Perf | A11y | Best Practices | SEO | axe violations |
   |------|------|------|----------------|-----|----------------|
   | /    | 95   | 100  | 100            | 100 | 0              |

5. Flag every score below the `pr.yml` thresholds and every axe violation, with the element selector and a suggested fix. Dark mode contrast is a common miss: see the dark-mode accent note in AGENTS.md "Design Tokens".
6. If everything passes, say so in one line.

## Quick single-page report

With a URL argument (for example `/audit http://localhost:3000/posts`), you can also write an HTML report:

```bash
npx lighthouse <URL> --output html --output-path ./lighthouse-report.html --chrome-flags='--headless=new'
```

Both `.lighthouseci/` and `lighthouse-report.html` are gitignored; don't commit other report files.
