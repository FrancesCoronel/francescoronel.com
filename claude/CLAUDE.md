# Personal Claude Tips

## General Behavior

Prefer minimal clarifying questions. If the task is reasonably clear, start working immediately and ask questions only if truly blocked. Bias toward action.

## Tech Specs

Use emoji when writing out tech specs where appropriate.

## Slack Canvases

When creating Slack canvases, always use emoji in section headers to make them visually scannable (e.g., "# Getting Started :rocket:", "# Best Practices :trophy:"). Use Slack-style emoji shortcodes (`:emoji_name:`) rather than Unicode emoji.

## Slack Messaging

When formatting Slack messages, use Slack's mrkdwn syntax: `*bold*` for bold (not `**bold**`), `_italic_` for italic, and `~strikethrough~` for strikethrough. Never use Markdown-style formatting in Slack messages.

When asked to draft a message, ask the user if they want to provide exact text or want Claude to draft it. Do not assume drafting is desired.

When composing Slack messages:

- Use `*bold*` for headers/section titles
- Add a blank line before each new header/section for visual breathing room
- Use emoji where appropriate (Slack-style `:shortcodes:`, not Unicode)
- Use bullet points for lists
- Link tickets, PRs, and Slack threads inline

**CRITICAL: BEFORE composing any content in Frances's voice, ALWAYS read the matching skill file and follow its format exactly.**

Never draft content from memory — always load the relevant skill file before writing.

## Skills Reference

### Writing

| Skill | Command | When to use |
| --- | --- | --- |
| **Tone & Voice** | `/tone-voice` | Unified style guide — read this first for any platform (Slack, GitHub, docs) |

### Slack

| Skill | Command | When to use |
| --- | --- | --- |
| **Slack Draft** | `/slack-draft` | Draft or send any Slack message — asks "your text or mine?", formats with mrkdwn, previews before sending |
| **Slack Project Update** | `/slack-project-update` | Weekly/daily project status posts with phases, accomplishments, blockers, next steps |
| **Slack Summary** | `/slack-summary` | Meeting, huddle, or thread recaps with numbered sections and calls to action |
| **Slack Message** | `/slack-message` | Conversational messages in Frances's voice — tone, emoji, word choice |

### Git

| Skill | Command | When to use |
| --- | --- | --- |
| **PR Description** | `/pr-description` | Create or update PR descriptions with Why, Testing, Before/After, Risks |
| **Code Review** | `/code-review` | Review a PR for quality — always proceeds on drafts, outputs findings in chat only |

## Git & PRs

When editing PR descriptions, ALWAYS append or modify specific sections — never overwrite the entire description. Preserve all existing content including uploaded images and screenshots.

All PRs should be created as drafts with auto-merge enabled. After creating a PR, auto-open it in the browser.

## Branch Management

**CRITICAL: When given a PR URL, ALWAYS check out the PR's branch before making changes**

When a user provides a GitHub PR URL (e.g., `https://github.com/org/repo/pull/12345`):

1. **Get the PR branch**: Run `gh pr view <PR_NUMBER> --json headRefName --jq '.headRefName'`
2. **Switch to that branch**: Run `git checkout <branch-name>`
3. **Verify you're on the correct branch**: Run `git branch --show-current`
4. **Then make changes**: Only after confirming the correct branch

**NEVER assume the current branch is the right one** — always verify against the PR.

---

**CRITICAL: Always start new work from a clean branch off master**

### Branch Naming Format

All new branches MUST follow this format:

```
YYYY-MM-DD-frances-<description>
```

Examples:

- `2025-01-28-frances-new-feature-modal`
- `2025-01-28-frances-bugfix-section-header`
- `2025-01-28-frances-refactor-search-api`

### Creating New Branches (AUTOMATED WORKFLOW)

**When I ask you to create a new branch or start new work, ALWAYS execute these steps automatically:**

1. **Check current status**: Run `git status` to see current branch
2. **Switch to master and ensure it's clean**: Run `git checkout master`
3. **Pull latest changes**: Run `git pull origin master` (or just `git pull`)
4. **Verify master is up to date**: Check the pull output to confirm "Already up to date" or successful pull
5. **Create new dated branch**: Run `git checkout -b YYYY-MM-DD-frances-<description>`
   - Use TODAY'S date
   - Use hyphens (not underscores) to separate words
   - Keep description concise and descriptive

```bash
# Complete workflow (run these commands in sequence):
git status
git checkout master
git pull
git checkout -b YYYY-MM-DD-frances-<description>
```

**Why this matters**:

- Clean commit history in PRs (only your changes)
- No unrelated commits from other feature branches
- Easier code review for teammates
- Cleaner git history overall
- Date prefix makes it easy to track when work started

### Commit and Push Workflow

**CRITICAL: Automatically commit and push after each completed change**

After verifying that formatting, linting, and type checks pass:

1. **Commit immediately** — don't wait for the user to ask
2. **One commit per logical change** — keep commits focused and atomic for a clean history
3. **Push after each commit** — so the PR stays up to date
4. **Use descriptive commit messages** — explain the "what" concisely

**Why this matters**:

- Clean, reviewable commit history (each commit is self-contained)
- Easier to review PR commit-by-commit
- No giant "do everything" commits that are hard to understand
- Changes are pushed promptly so CI runs and reviewers see progress

## Pull Request Title Format

All PR titles MUST follow this format:

```
[Feature] - brief description of changes - phase if applicable
```

**Examples:**

- `[Feature Modal] Logic updates - Phase 5`
- `[Search] Improve autocomplete performance`
- `[Sidebar] Add new section icons - Phase 2`
- `[Bugfix] Fix avatar rendering in DM list`

**Format breakdown:**

- **[Feature]**: Bracketed feature/component name (title case)
- **Brief description**: Lowercase, concise description of changes
- **Phase**: Optional, include if work is part of multi-phase project

**Why this format:**

- Easy to scan in PR list
- Clear grouping by feature area
- Phase information helps reviewers understand project context

## Pull Request Creation

**CRITICAL: Always create PRs as drafts with auto-merge enabled**

When creating a PR using the `gh` CLI, ALWAYS:

1. Create as a **draft** (`--draft`)
2. Immediately enable **auto-merge** after creation (`gh pr merge --auto --squash`)
3. **Open the PR in the browser** (`gh pr view --web`)

```bash
# Standard PR creation workflow:
gh pr create --draft --title "[Feature] - description" --body "..."
gh pr merge --auto --squash
gh pr view --web
```

**Why this matters:**

- Draft PRs signal the work is in progress and prevents accidental merges before review
- Auto-merge ensures the PR merges automatically once all required checks pass and approvals are given
- No manual merge step needed — just get approvals and let CI do the rest
- Opening in browser lets you immediately review, add reviewers, and monitor CI

## Pull Request Descriptions

Use `/pr-description` skill for the full template. When editing an existing description, ALWAYS append or modify specific sections — never overwrite. Preserve all existing content including uploaded images and screenshots.

## Code Review

Use `/code-review` skill for structured PR reviews. Always proceed regardless of draft status — do not refuse to review draft PRs.
