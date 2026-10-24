# Code Review

Review a pull request for code quality, correctness, and adherence to project standards.

## Workflow

1. **Identify the PR**: If a PR URL or number is given, use `gh pr view` to get the branch and diff. If no PR is specified, review the current branch against `master`.
2. **Get the full diff**: Run `gh pr diff` or `git diff master...HEAD` to see all changes.
3. **Review commit-by-commit**: Check each commit individually for focused, logical changes.
4. **Output findings in chat only** — do NOT post comments to GitHub unless explicitly asked.

## What to Check

### TypeScript / JavaScript

- Type safety — no `any` casts without justification, proper generics usage
- Unused imports or variables
- Missing null/undefined checks at system boundaries
- Proper error handling (no swallowed errors)
- i18n — all user-visible strings wrapped in translation functions

### React / Components

- Functional components with hooks (no class components in new code)
- Memoization where appropriate (`useMemo`, `useCallback` for expensive ops or referential stability)
- Stable selectors — no inline object/array creation in `useSelector` calls
- Proper dependency arrays on `useEffect`, `useMemo`, `useCallback`
- No direct DOM manipulation — use refs when necessary

### CSS / Styling

- Flag any `!important` usage — must have explicit justification
- Consistent use of design tokens / CSS custom properties
- No hardcoded colors or magic numbers without explanation
- Responsive considerations

### General

- No secrets, credentials, or PII in code
- No `console.log` statements left in (use proper logging)
- Feature flags used appropriately for new features
- Test coverage — are new code paths tested?
- Backwards compatibility if touching shared APIs

## Output Format

Structure findings by severity:

```
**Must Fix** :rotating_light:
- [file:line] Description of critical issue

**Should Fix** :warning:
- [file:line] Description of recommended improvement

**Nit** :thought_balloon:
- [file:line] Minor suggestion or style preference

**Looks Good** :white_check_mark:
- Brief summary of what's well done
```

## Rules

- ALWAYS proceed with the review regardless of PR draft status
- Focus on substance — skip trivial formatting issues that linters catch
- Give specific file paths and line numbers for every finding
- Explain the "why" behind each finding, not just the "what"
- Acknowledge good patterns and thoughtful code, not just problems
- If the PR is large, call out which files need the most attention
- Do NOT suggest unrelated refactors or scope creep

## Instructions

Start by getting the PR diff. If the user provides a PR URL, extract the number and use `gh pr diff`. Review all changed files systematically and present findings using the output format above. Keep feedback actionable and specific.
