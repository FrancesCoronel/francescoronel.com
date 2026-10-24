---
name: deploy
description: Build the site and push the current branch to trigger a Vercel deployment.
disable-model-invocation: true
---

# Build and deploy 🚀

Build the site and push to trigger a Vercel deployment.

## What to do

1. Run `npm run build`. It also runs the `postbuild` step (Pagefind indexing).
2. If the build fails, show the errors and suggest fixes. Don't push broken code.
3. If the build succeeds, show the build summary:
   - Total pages generated
   - Pagefind index stats
   - Any warnings worth noting
4. If there are uncommitted changes, ask before committing.
5. Push the current branch with `git push`.
6. Show the Vercel deployment URL if available (`vercel` CLI, or the GitHub push trigger).

## Important

- Never force push.
- Never push to `main` without asking first.
- If the build warns about missing images or broken links, flag them before pushing.
