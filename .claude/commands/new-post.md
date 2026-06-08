# /new-post — Scaffold a New Blog Post ✍🏽

Create a new MDX blog post with frontmatter template.

## What to do

1. Ask for the post title if not provided as an argument
2. Generate a slug from the title (lowercase, hyphens, no special chars)
3. Create `content/posts/<slug>.mdx` with this frontmatter template:

```yaml
---
title: "<Title>"
slug: "<slug>"
date: "<today's date YYYY-MM-DD>"
excerpt: ""
featuredImage: ""
categories: []
tags: []
organizations: []
skills: []
source: "nextjs"
---
```

4. Show available categories and tags from `content/categories.json` and `content/tags.json` so the user can pick
5. Show available organizations from `content/organizations.json` for cross-linking
6. Open the file for editing

## Slug rules

- Lowercase everything
- Replace spaces with hyphens
- Strip special characters except hyphens
- Example: "I Think I'm Becoming a Cracked Engineer" → `i-think-im-becoming-a-cracked-engineer`

## After creation

Remind the user:
- Add an excerpt (shows in blog listing cards)
- Add a featured image URL
- Pick categories and tags from the available options
- The post will appear at `/blog/<slug>` after the next build

> **Tip:** If you have source material (a Claude artifact, notes, transcript, or outline), use `/draft-post` instead — it writes the full post body for you.
