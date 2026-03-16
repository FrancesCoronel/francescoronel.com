# Slack Draft

Draft or send a Slack message with proper formatting. This skill handles the full flow from drafting to sending via MCP.

## First Question (ALWAYS ask this first)

Before writing anything, ask:

> Do you want to provide the exact text, or should I draft it?

- If the user wants to **provide text**: Wait for their text, then format it with proper Slack mrkdwn and send/present it
- If the user wants **Claude to draft**: Ask for context (channel, audience, topic) then draft using Frances's voice from `slack-message.md`

## Formatting Rules (Slack mrkdwn)

- `*bold*` for bold (single asterisks) — NEVER `**double asterisks**`
- `_italic_` for italic
- `~strikethrough~` for strikethrough
- `` `code` `` for inline code
- `>` for block quotes
- Use Slack emoji shortcodes (`:emoji_name:`) not Unicode emoji
- Links: `<url|display text>` format

## Channel Context

If the user specifies a channel, use Slack MCP to:

1. Read recent messages for context (`mcp__slack__slack_read_channel`)
2. Check if it's a thread reply (use `mcp__slack__slack_read_thread`)
3. Match the tone and formality of the channel

## Sending Flow

1. **Draft first** — always show the message to the user before sending
2. **Confirm** — ask "Send this?" or wait for approval
3. **Send** — use `mcp__slack__slack_send_message` or `mcp__slack__slack_send_message_draft`

If the user says "send" or "post" upfront, still show a preview and confirm before actually sending.

## Message Types

### Quick Reply

- Short, casual, lowercase okay
- End with emoji instead of punctuation
- Match the thread's energy

### Announcement / Update

- Use the `/slack-project-update` skill instead for structured updates
- For lighter announcements: `*bold title*` + brief body + emoji

### Thread Reply

- Read the thread first for context
- @mention the person you're replying to if needed
- Keep it focused on the specific point

### DM

- Warm, direct tone
- No need for headers or structure
- Conversational

## Rules

- NEVER use Markdown formatting (`**bold**`, `### headers`) — Slack uses its own mrkdwn
- NEVER send without showing the user a preview first
- Link tickets, PRs, and Slack threads inline when mentioned
- Add a blank line before each new `*bold header*` for visual breathing room

## Instructions

Start by asking whether the user wants to provide text or wants a draft. Then follow the appropriate flow above. Always show a preview before sending.
