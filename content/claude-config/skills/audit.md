# /audit — Performance & Accessibility Audit 🔍

Run Lighthouse and pa11y audits, then summarize results.

## What to do

1. Check if a dev or production server is running on localhost:3000
   - If not, start one with `npm run start` (needs a prior build) or `npm run dev`
2. Run audits in parallel where possible:
   - `npx @lhci/cli autorun` — Lighthouse CI (uses `lighthouserc.json` config)
   - `npx pa11y-ci --config .pa11yci.json` — WCAG2AA accessibility
3. Summarize results in a table:

   | Page | Perf | A11y | Best Practices | SEO |
   |------|------|------|----------------|-----|
   | /    | 95   | 98   | 100            | 100 |

4. Flag any scores below thresholds (perf 90, a11y 90, best-practices 90, SEO 95)
5. List specific a11y violations from pa11y with element selectors and fix suggestions
6. If everything passes, confirm with a clean summary

## Thresholds (from lighthouserc.json)

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 95+

## Quick single-page audit

If the user passes a URL argument (e.g., `/audit http://localhost:3000/blog`), run a single-page Lighthouse report instead:

```bash
npx lighthouse <URL> --output html --output-path ./lighthouse-report.html --chrome-flags='--headless=new'
```
