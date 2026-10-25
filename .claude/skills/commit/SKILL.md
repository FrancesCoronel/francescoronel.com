---
name: commit
description: Stage and commit the current changes with a conventional commit message.
disable-model-invocation: true
---

# Commit 📝

Stage and commit changes with a message that matches this repo's history.

## What to do

1. Run `git status` and `git diff --staged` to see what changed.
2. If nothing is staged, stage the relevant files. Never stage `.env*`, `node_modules/` or `.next/`.
3. Work out what was added, changed or fixed.
4. Write a conventional commit message:
   - First line: `type(scope): summary`, imperative mood, under 72 characters. Types used here: `feat`, `fix`, `content`, `chore`, `ci`, `docs`. Scope is optional (`fix(a11y): ...`, `chore(deps): ...`). New or updated posts use `content: ...`.
   - Then a blank line and short bullets if the change touches several things.
   - End with the attribution lines the session provides, if any. Don't hardcode a model name.
   - No em dashes.
5. Create the commit.
6. Show the commit hash and summary.

Keep it short: the diff tells the full story.
