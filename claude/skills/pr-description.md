# PR Description

Create or update a pull request description using Frances's standard template. Use emoji after section titles, proper spacing, and conversational detail.

When editing an existing PR description, ALWAYS append or modify specific sections — never overwrite the entire description. Preserve all existing content including uploaded images and screenshots.

## Core Template (Always Include)

```markdown
## Why 🤔

- Clear bullet points explaining the motivation and problem being solved
- Multiple bullets showing different aspects of the issue
- Focus on user impact and business value

## Testing 🧪

- [x] All unit tests passing
- [x] Manually tested [specific scenario]
- [x] Verified [expected behavior]
- [x] Checked for regressions

## Before/After Demos 📸

| Before | After |
| --- | --- |
| [description]<br><br>![screenshot](url) | [description]<br><br>![screenshot](url) |

*(Add inline text descriptions above screenshots to highlight specific issues being fixed)*

## Risks ⚠️

- **[Risk category]**: [Description of risk]
- **Mitigation**: [How the risk is mitigated]
- [Additional risk considerations]

## Revert Plan 🔄

- Revert this PR if [condition]
- [Any cleanup steps needed]
- [How to verify the revert worked]
```

## Optional Sections (Include if relevant)

```markdown
## Tickets 🎫

- [PROJ-123](link) - Description of ticket
- [PROJ-456](link) - Description of ticket

## Project Channel 💬

[#proj-channel-name](link)

## Feature Flag 🚀

[`flag_name`](flag-link)

## Figma Design 🎨

[Design link](figma-url)

## Preview 🔍

### Treatment 🆕

<https://preview-url-with-feature-enabled>

### Control

<https://preview-url-with-feature-disabled>

## Notes for Reviewers ✏️

- **Focus areas**: [What reviewers should pay attention to]
- **Commit-by-commit review**: Each commit is self-contained and can be reviewed individually for easier review
- **Files needing extra attention**:
  - `path/to/file.ts` - [Why this file is important]
  - `path/to/other.ts` - [Context about changes]
- **Context**: [Background information that helps reviewers understand the changes]

## Changes Made 🔧

- ✅ Change 1 with detailed explanation
- ✅ Change 2 with context
- ✅ Change 3 with reasoning

## Relevant Links 🔗

- 💬 **Depends on**: [PR description](PR-link)
- 💬 **Slack Discussion**: [Descriptive title of discussion](slack-link)
- 💬 **Related Issue**: [Issue description](issue-link)
```

## Guidelines

- Use conversational, detailed bullet points
- Include inline descriptions in Before/After screenshots
- Add preview links with feature flag overrides when applicable
- Focus on reviewer experience — give them context
- Add blank line after each header before content
- Only include sections that are relevant
- Do NOT add `---` separator lines
- Do NOT add Claude Code attribution at the end
- **Always use descriptive link text** — never use naked URLs
- **Note for reviewers about commit-by-commit review**: Add a note in "Notes for Reviewers" that commits can be reviewed individually since each commit contains focused, individual changes

## Instructions

When creating a new PR description, analyze all staged/committed changes to understand what changed and why. Use git diff and commit history to populate the template sections accurately. When updating an existing description, preserve all existing content and only modify the relevant sections.
