# /draft-post — Draft a Full Blog Post from Source Material ✍🏽

Turn an artifact URL, notes, outline, or transcript into a complete, publish-ready MDX blog post.

## What to do

1. **Get the source material** — accept as argument or ask the user:
   - A Claude artifact URL (`https://claude.ai/public/artifacts/...`)
   - A URL to fetch (article, transcript, doc)
   - Raw notes or outline pasted directly
   - A path to a local file

2. **Fetch / read the source** using WebFetch (for URLs) or Read (for local files). Extract:
   - Core topic and narrative arc
   - Key sections, claims, anecdotes, and quotes
   - Author's voice and any first-person details

3. **Ask for the post title** if not obvious from the source, then generate a slug:
   - Lowercase, hyphens, no special chars
   - Example: "How Claude Helped Me Navigate a Travel Nightmare" → `how-claude-helped-me-navigate-a-travel-nightmare`

4. **Pick metadata** — read `content/categories.json`, `content/tags.json`, and `content/organizations.json`, then select the best matches based on the post content. Prefer existing values over inventing new ones.

5. **Write the full post** in Frances' first-person voice:
   - Conversational but substantive — personal story + practical insight
   - Use `##` section headings with a blank line before and after
   - Use `---` horizontal rules to separate major narrative beats
   - Italicize the closing call-to-action line
   - Emoji in headings only when it fits naturally (not forced)
   - No filler phrases ("In conclusion", "It's worth noting", "Dive into")
   - End with a genuine reflection or takeaway, not a summary

6. **Write the excerpt** — 1–2 sentences, punchy, shows in blog listing cards

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

8. **Remind the user** to add a `featuredImage` URL before publishing (upload to Vercel Blob — see CLAUDE.md for the upload snippet).

## Voice guidelines

- Write as Frances: a Senior Software Engineer at Slack, PADI Divemaster candidate, Latina in tech, community builder
- First person throughout
- Mix technical precision with human warmth
- Specific > generic — real details beat vague claims
- Sections should feel like they could stand alone, not depend on reading in order

## Slug rules

- Lowercase everything
- Replace spaces with hyphens
- Strip special characters except hyphens

## After creation

- Remind the user to add a `featuredImage` (upload image to Vercel Blob first)
- Run `/commit` then `/deploy` when ready to publish
- The post will appear at `/blog/<slug>` after the next build
