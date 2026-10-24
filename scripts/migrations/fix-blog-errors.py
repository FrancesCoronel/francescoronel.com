#!/usr/bin/env python3
"""
Fix common Vale errors in blog MDX files:
1. Missing spaces after sentence-ending punctuation (Google.Spacing)
2. Brand name capitalization (Vale.Terms)
3. Repeated words (Vale.Repetition)
"""

import os
import re
import sys
from pathlib import Path

BLOG_DIR = Path(__file__).parent.parent / "content" / "blog"

# Brand name corrections (case-insensitive → correct form)
BRAND_FIXES = {
    "webflow": "Webflow",
    "github": "GitHub",
    "linkedin": "LinkedIn",
    "latinx": "Latinx",
    "techqueria": "Techqueria",
    "typescript": "TypeScript",
    "javascript": "JavaScript",
    "byteboard": "Byteboard",
    "dreamforce": "Dreamforce",
    "codenewbie": "CodeNewbie",
    "corgis": "Corgis",
    "pwa": "PWA",
}

# Words that are intentionally repeated (not errors)
INTENTIONAL_REPEATS = {
    "dun", "dum", "blah", "ha", "la", "na", "no", "oh",
    "very", "really", "so", "go", "boom", "bang", "da",
    "do", "ya", "yeah", "yep", "ok", "bye", "hey",
    "choo", "knock", "cha", "wa", "bam", "pow", "tick",
    "tock", "beep", "boop", "nom",
}

stats = {
    "files_processed": 0,
    "files_modified": 0,
    "spacing_fixes": 0,
    "brand_fixes": 0,
    "frontmatter_source_fixes": 0,
    "repeat_fixes": 0,
}


def fix_spacing(text: str) -> str:
    """Insert missing space after sentence-ending punctuation before a capital letter."""
    count = 0

    def replacer(m):
        nonlocal count
        # Don't fix inside URLs
        before = text[max(0, m.start() - 20):m.start()]
        if "http" in before or "://" in before or ".com" in before or ".org" in before:
            return m.group(0)
        # Don't fix abbreviations like U.S.A or e.g.
        if len(m.group(1)) == 1 and m.group(1).isupper():
            return m.group(0)
        count += 1
        return m.group(1) + m.group(2) + " " + m.group(3)

    # Match: word_char + sentence_ender + capital_letter (no space between)
    result = re.sub(r'(\w)([.!?])([A-Z])', replacer, text)
    return result, count


def fix_brands_in_content(text: str, in_frontmatter: bool) -> str:
    """Fix brand name capitalization in content (not frontmatter keys)."""
    count = 0

    for wrong, correct in BRAND_FIXES.items():
        if in_frontmatter:
            continue

        # Case-insensitive word boundary match, but skip if already correct
        def brand_replacer(m):
            nonlocal count
            if m.group(0) == correct:
                return m.group(0)
            # Don't replace inside URLs or code
            start = max(0, m.start() - 30)
            context = text[start:m.start()]
            if any(x in context for x in ["http", "://", "`", "```", ".com/", ".org/", ".io/"]):
                return m.group(0)
            count += 1
            return correct

        text = re.sub(r'\b' + re.escape(wrong) + r'\b', brand_replacer, text, flags=re.IGNORECASE)

    return text, count


def fix_repeated_words(text: str) -> str:
    """Remove accidentally repeated words."""
    count = 0

    def replacer(m):
        nonlocal count
        word = m.group(1).lower()
        if word in INTENTIONAL_REPEATS:
            return m.group(0)
        count += 1
        return m.group(1)

    result = re.sub(r'\b(\w+)\s+\1\b', replacer, text, flags=re.IGNORECASE)
    return result, count


def process_file(filepath: Path) -> bool:
    """Process a single MDX file. Returns True if modified."""
    content = filepath.read_text(encoding="utf-8")
    original = content

    # Split into frontmatter and body
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            body = parts[2]

            # Fix source: "webflow" → source: "Webflow" in frontmatter
            if 'source: "webflow"' in frontmatter:
                frontmatter = frontmatter.replace('source: "webflow"', 'source: "Webflow"')
                stats["frontmatter_source_fixes"] += 1

            # Fix brands in frontmatter (only specific fields like excerpt)
            # Skip this — frontmatter brand names are slugs/identifiers

            # Fix spacing in body (skip code blocks)
            fixed_body = fix_body_content(body)

            content = "---" + frontmatter + "---" + fixed_body
        else:
            content = fix_body_content(content)
    else:
        content = fix_body_content(content)

    if content != original:
        filepath.write_text(content, encoding="utf-8")
        stats["files_modified"] += 1
        return True
    return False


def fix_body_content(body: str) -> str:
    """Fix content while preserving code blocks."""
    # Split by code blocks to avoid modifying code
    parts = re.split(r'(```[\s\S]*?```|`[^`\n]+`)', body)
    result_parts = []

    for i, part in enumerate(parts):
        if i % 2 == 1:
            # This is a code block — skip
            result_parts.append(part)
        else:
            # This is regular content — fix it
            fixed, spacing_count = fix_spacing(part)
            stats["spacing_fixes"] += spacing_count

            fixed, brand_count = fix_brands_in_content(fixed, in_frontmatter=False)
            stats["brand_fixes"] += brand_count

            fixed, repeat_count = fix_repeated_words(fixed)
            stats["repeat_fixes"] += repeat_count

            result_parts.append(fixed)

    return "".join(result_parts)


def main():
    mdx_files = sorted(BLOG_DIR.glob("*.mdx"))
    print(f"Found {len(mdx_files)} MDX files")

    for filepath in mdx_files:
        stats["files_processed"] += 1
        process_file(filepath)
        if stats["files_processed"] % 100 == 0:
            print(f"  Processed {stats['files_processed']}...")

    print(f"\nDone! Processed {stats['files_processed']} files.")
    print(f"  Modified: {stats['files_modified']} files")
    print(f"  Spacing fixes: {stats['spacing_fixes']}")
    print(f"  Brand name fixes: {stats['brand_fixes']}")
    print(f"  Frontmatter source fixes: {stats['frontmatter_source_fixes']}")
    print(f"  Repeated word fixes: {stats['repeat_fixes']}")


if __name__ == "__main__":
    main()
