# Slack Project Update

Draft a project update using Frances's standard format for end-of-week (or start-of-week) updates posted to Slack channels.

## Format

Use Slack mrkdwn syntax (`*bold*` not `**bold**`). Use Slack-style emoji shortcodes (`:emoji_name:`) not Unicode emoji.

```
*Title — Project Name* :sparkles:

:one: *Phase/Workstream Name* (<link|flag_name>)
• :check_green: Date — What was completed
• :soon: Date — What's upcoming

:two: *Phase/Workstream Name* (<link|flag_name>)
• :check_green: Date — What was completed
• :soon: Date — What's upcoming

:wrench: *This Week*
• Bullet points of accomplishments — link tickets, PRs, and @ mention people

:rotating_light: *Blocking Bugs* (link to source thread)
• :check_green: PROJ-XXXX Done item — in PR
• :construction: PROJ-XXXX Still needs work

:dart: *Next Week*
• Bullet points of what's coming — include team coordination, rollout plans
```

## Key Principles

- Headers use `*single asterisk bold*` (Slack mrkdwn syntax)
- Add a blank line before each emoji-prefixed section header for visual breathing room
- Rollout schedules list each date on its own line with :check_green: or :soon:
- "What got done" includes specific accomplishments, not just categories
- Blocking bugs split into what's done (:check_green:) vs what's remaining (:construction:)
- Link to source conversations (e.g., "per Celia's input" links to the actual thread)
- End with next week focus including team coordination and upcoming milestones
- No colons after ticket numbers (e.g., "PROJ-1234 Description" not "PROJ-1234: Description")
- Link tickets, feature flags, PRs, and Slack threads inline

## Data Sources

When drafting the update, pull from these sources if available:

- Jira MCP: Search for recent ticket updates in the relevant project
- Slack MCP: Read recent messages from the project channel for context
- Git log: Check recent commits and PRs for accomplishments

## Instructions

Ask the user which project/channel this update is for, then gather context and draft the update. If the user provides a project channel, read recent messages to inform the content.
