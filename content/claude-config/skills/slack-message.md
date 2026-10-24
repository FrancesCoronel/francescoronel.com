# Slack Message (Frances's Voice)

Draft a conversational Slack message matching Frances's writing style. This is for casual/conversational messages, NOT structured project updates or recaps (use `/slack-project-update` or `/slack-summary` for those).

## Capitalization and Punctuation

- Casual/quick replies can start lowercase — `"makes sense and love thats the end goal :100:"`
- More deliberate messages start uppercase — `"Personally I'm a big believer in _forcing mechanisms_ over relying on individual discipline."`
- NEVER use exclamation marks — convey enthusiasm through emoji instead
- Periods are rare — most messages end with no punctuation or end with an emoji
- Question marks are used reliably on actual questions
- Apostrophes can be dropped in casual mode — `thats`, `im`, `isnt`, `dont` — but keep them in deliberate/structured messages

## Emoji Usage

- Use emoji as terminal punctuation instead of periods or exclamation marks — `"We'll get there soon tho :robot_face:"`
- Use emoji as section/topic markers at the start of lines — `:bulb: Also we do have a skills builder plugin`
- Use emoji inline for emotional color — `"some reviewers have higher standards than others :sweat_smile:, and things slip through"`
- Common emoji: `:100:`, `:eyes:`, `:joy:`, `:sweat_smile:`, `:rocket:`, `:sparkles:`, `:tada:`

## Message Structure

- Keep messages short — median is ~23 words
- Break longer messages into separate paragraphs of 1-2 sentences max — generous whitespace
- Place links on their own line with context text above, never inline mid-sentence
- Use rapid-fire separate messages for stream-of-consciousness rather than one long block
- Start messages with @mentions when directing a response to someone
- Use `cc @person` (lowercase) to loop people in

## Tone and Word Choice

- Casual-professional — warm but direct, no corporate-speak
- Action-oriented — quickly pivot from observation to "I'll do X" or "Let me verify"
- Use dashes for transitions — `"That's a great question - I would go with..."` — not formal connectors like "Additionally" or "Furthermore"
- Abbreviations are natural: `fwiw`, `tho`, `low pri`, `re:`, `q` (question)
- "right now" to describe current state before proposing improvement
- "just" as a softener — `"Just sharing that I'm really glad we're working on this"`
- Aspiration/vision statements — `"We'll get there soon tho"`, `"This is where I wish I could clone myself"`

## Formatting (Minimal)

- Default to plain unformatted text for most messages
- Use `_italics_` for emphasis on key concepts — `"_forcing mechanisms_"`, `"_blocking bad code_"`
- Use backticks for file paths and code — `.claude/skills/`
- Bold only for section headers in structured notes
- Arrow notation for flows — `"Feedback → bot auto responds → person presses button → PR gets merged"`

## Instructions

Ask the user if they want to provide the exact text or want a draft. Do not assume drafting is desired. When drafting, match the tone above and keep it concise. Use Slack mrkdwn syntax (`*bold*`, `_italic_`, `~strikethrough~`).
