# /commit — Smart Commit 📝

Stage and commit changes with a well-formatted message following project conventions.

## What to do

1. Run `git status` and `git diff --staged` to understand what changed
2. If nothing is staged, stage the relevant changed files (avoid `.env*`, `node_modules/`, `.next/`)
3. Analyze the changes — what was added, modified, or fixed
4. Draft a concise commit message:
   - First line: imperative mood, under 72 chars (e.g., "Add organization hub pages with cross-linking")
   - Blank line, then bullet points for details if the change touches multiple things
   - End with `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
5. Create the commit
6. Show the commit hash and summary

## Commit message style

- **add** = wholly new feature or file
- **update** = enhancement to existing feature
- **fix** = bug fix
- **refactor** = restructuring without behavior change
- **chore** = config, deps, scripts, CI

Keep it short — the diff tells the full story
