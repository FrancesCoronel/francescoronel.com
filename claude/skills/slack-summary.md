# Slack Summary / Recap

Draft a structured summary of a meeting, huddle, thread, or discussion using Frances's standard recap format.

## Format

Use Slack mrkdwn syntax (`*bold*` not `**bold**`). Use Slack-style emoji shortcodes (`:emoji_name:`) not Unicode emoji.

```
*Title — Topic Name* :relevant-emoji::optional-second-emoji:

Brief 1-line context sentence with @mentions and links :eyes:

:one: *Section title*
• Bullet point with key takeaway — @mention the person who raised it
• Another bullet point
• Keep bullets concise, not full paragraphs
:two: *Section title*
• <@USER_ID> called out that...
• Another point
:three: *Section title*
• Bullet
• Bullet
:dart: *Calls to Action*
• :relevant-emoji: *Bold CTA title*
    ◦ sub-bullet with detail
    ◦ another sub-bullet
• :another-emoji: *Bold CTA title*
    ◦ sub-bullet with detail
```

## Key Principles

- Use `•` bullet points under each numbered section, NEVER prose paragraphs
- No blank lines between numbered sections — keep them tight and compact
- No intermediate section headers like "Key Themes" — jump straight from intro to `:one:`
- @mention people inline in bullets when attributing ideas (`<@USER_ID>` format)
- Calls to action: each CTA gets a unique emoji prefix + `*bold title*` + indented `◦` sub-bullets for details
- Do NOT create a separate "Resources" section — weave links into the relevant numbered sections or CTAs
- Use unique, expressive emoji per CTA item (`:file_folder:`, `:rocket:`, `:robot_face:`, `:book:`, etc.) not generic ones
- Title line can stack multiple emoji

## Instructions

Ask the user for the source material (Slack thread URL, meeting notes, or pasted content). If given a Slack thread URL, read it via the Slack MCP. Organize the content into logical sections, attribute ideas to the people who raised them, and end with clear calls to action.
