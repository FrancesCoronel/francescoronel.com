# /deploy — Build & Deploy 🚀

Build the site and push to trigger a Vercel deployment.

## What to do

1. Run `npm run build` — this also runs the `postbuild` step (Pagefind indexing)
2. If the build fails, show the errors and suggest fixes — do NOT push broken code
3. If the build succeeds, show the build summary:
   - Total pages generated
   - Pagefind index stats
   - Any warnings worth noting
4. Check if there are uncommitted changes — if so, ask before committing
5. Push to the current branch with `git push`
6. Show the Vercel deployment URL if available (`vercel` CLI or just the GitHub push trigger)

## Important

- Never force push
- Never push to main/master without asking first
- If the build has warnings about missing images or broken links, flag them before pushing
