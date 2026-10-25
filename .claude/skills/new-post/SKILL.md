---
name: new-post
description: Scaffold an empty MDX blog post with the frontmatter template in content/posts/. Use when Frances wants to start a new post from a title only.
argument-hint: "[title]"
---

# Scaffold a new blog post ✍🏽

Create a new MDX blog post with the frontmatter template.

## What to do

1. Use the title in `$ARGUMENTS`, or ask for one.
2. Make a slug from the title (see Slug rules).
3. Create `content/posts/<slug>.mdx` with this frontmatter:

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

   Optional fields: `crosspost: false` skips dev.to, Hashnode and Buffer; `social: "..."` sets custom intro text for the Buffer drafts. `updated` is only for revising an older post.
4. Show the available categories and tags from `content/categories.json` and `content/tags.json` so Frances can pick.
5. Show the available organizations from `content/organizations.json` for cross-linking.
6. Open the file for editing.

## Site rules

- No em dashes in anything you write into the post (title, excerpt, headings).
- Any emoji that takes a skin tone uses medium skin tone 🏽.

## Slug rules

- Lowercase everything
- Replace spaces with hyphens
- Strip special characters except hyphens
- Example: "I Think I'm Becoming a Cracked Engineer" becomes `i-think-im-becoming-a-cracked-engineer`

## After creation

Remind Frances to:

- Add an excerpt (shows on listing cards)
- Add a featured image URL (Vercel Blob)
- Pick categories and tags from the available options
- Run `/publish-post` when the post is written

> **Tip:** with source material (a Claude artifact, notes, transcript or outline), use `/draft-post` instead; it writes the full body.
