---
name: draft-post
description: Turn an artifact URL, notes, outline or transcript into a complete MDX blog post in content/posts/. Use when Frances shares source material and wants a full post written from it.
argument-hint: "<url-or-notes>"
---

# Draft a full blog post from source material ✍🏽

Turn an artifact URL, notes, outline or transcript into a complete, publish-ready MDX blog post.

## What to do

1. **Get the source material** from `$ARGUMENTS` or ask Frances for it:
   - A Claude artifact URL (`https://claude.ai/public/artifacts/...`)
   - A URL to fetch (article, transcript, doc)
   - Raw notes or an outline pasted directly
   - A path to a local file
2. **Read the source** with WebFetch (URLs) or Read (local files). Pull out:
   - The core topic and narrative arc
   - Key sections, claims, anecdotes and quotes
   - Frances's voice and any first-person details
3. **Ask for the post title** if the source doesn't make it obvious, then make a slug (see Slug rules). Example: "How Claude Helped Me Navigate a Travel Nightmare" becomes `how-claude-helped-me-navigate-a-travel-nightmare`.
4. **Pick metadata**: read `content/categories.json`, `content/tags.json` and `content/organizations.json` and choose the best matches. Use existing values; don't invent new ones.
5. **Write the full post** in Frances's first-person voice:
   - Conversational but substantive: personal story plus practical insight
   - `##` section headings with a blank line before and after
   - `---` horizontal rules between major narrative beats
   - Italicize the closing call-to-action line
   - Emoji in headings only when it fits naturally
   - No filler phrases ("In conclusion", "It's worth noting", "Dive into")
   - End with a genuine reflection or takeaway, not a summary
6. **Write the excerpt**: 1 to 2 punchy sentences; it shows on listing cards.
7. **Create `content/posts/<slug>.mdx`** with complete frontmatter and body:

   ```yaml
   ---
   title: "<Title>"
   slug: "<slug>"
   date: "<today's date YYYY-MM-DD>"
   excerpt: "<1-2 sentence hook>"
   featuredImage: ""
   categories: ["<slug>"]
   tags: ["<slug>", ...]
   organizations: ["<slug>", ...]
   skills: []
   source: "nextjs"
   ---
   ```

   Optional fields: `crosspost: false` skips dev.to, Hashnode and Buffer; `social: "..."` sets custom intro text for the Buffer drafts. Leave `updated` out of a new post.
8. **Remind Frances** to add a `featuredImage` (upload to Vercel Blob first; the snippet is in AGENTS.md "Image Hosting").

## Site rules

- No em dashes anywhere in the post or its frontmatter. Use a comma, colon, period or parentheses instead.
- Any emoji that takes a skin tone uses medium skin tone 🏽 (👋🏽, 👩🏽‍💻).

## Voice guidelines

- Write as Frances: a Senior Software Engineer at Slack, PADI Divemaster candidate, Latina in tech, community builder
- First person throughout
- Mix technical precision with human warmth
- Specific beats generic: real details over vague claims
- Each section should stand on its own

## Slug rules

- Lowercase everything
- Replace spaces with hyphens
- Strip special characters except hyphens

## After creation

- Remind Frances to add a `featuredImage`
- Run `/publish-post content/posts/<slug>.mdx` to check it and open a PR
- The post appears at `/posts/<slug>` after the next deploy
