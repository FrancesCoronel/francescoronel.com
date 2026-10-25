---
name: publish-post
description: Prepare content/posts/<slug>.mdx for publication. Use when Frances says a new post is ready, asks to set one up for publication, or points at a post she wrote in iA Writer.
argument-hint: "[content/posts/<slug>.mdx]"
---

# Publish a post ✍🏽

Get a post Frances wrote ready to merge. The words are hers: fix frontmatter and MDX, not the prose.

1. Read the post at `$ARGUMENTS` (ask for the path if none is given).
2. Fill missing frontmatter and leave existing values alone:
   - `title`, `slug` (matches the file name), `date` (YYYY-MM-DD, today if unset), `excerpt` (1 to 2 sentences, shows on listing cards), `source: "nextjs"`.
   - `featuredImage`: a Vercel Blob URL. Ask Frances for an image if there isn't one.
   - Optional: `updated` (only for a meaningful revision of an older post), `crosspost: false` (skip dev.to, Hashnode and Buffer), `social: "..."` (custom intro text for the Buffer drafts).
3. Pick `categories`, `tags` and `organizations` only from `content/categories.json`, `content/tags.json` and `content/organizations.json`. Suggest new values to Frances instead of inventing them.
4. Upload local images to Vercel Blob with the snippet in AGENTS.md "Image Hosting" and swap in the blob URLs. Never link external CDNs.
5. Site rules for anything you write (frontmatter, alt text, headings): no em dashes, and skin-tone emoji always use 🏽.
6. Make sure the MDX compiles: escape bare `<` outside code, close every JSX tag.
7. Run `npm run lint:md` and `npm run build`, and show the output.
8. Commit on a branch (`content: publish the <title> post`) and open a PR. Don't push to `main`; merging it deploys and fires cross-posting.
