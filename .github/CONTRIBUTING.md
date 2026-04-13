# Contributing

This is a personal website. External contributions are welcome for:

- **Bug reports** — broken links, rendering issues, accessibility problems
- **Typo or content fixes** — small corrections to existing posts or pages
- **Performance or a11y improvements** — measurable wins with Lighthouse or pa11y evidence

## What I won't accept

- New blog posts or content on my behalf
- Design overhauls or significant layout changes
- Dependency upgrades without a clear bug fix rationale

## How to contribute

1. [Open an issue](../../issues/new/choose) first for anything beyond a one-line fix
2. Fork the repo and create a branch off `main`
3. Make your change, run `npm run lint` and `npm run build` locally
4. Open a pull request — describe what and why, link the issue

## Local setup

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # full build + Pagefind index
npm run lint      # ESLint + Markdown lint
```

## Code style

- TypeScript everywhere (strict mode)
- Tailwind CSS 4 utility classes — no new CSS files
- Follow the existing component patterns in `components/`
- No new dependencies without discussion in an issue first
