/**
 * Sanitizes MDX content from Webflow-converted blog posts.
 * Escapes bare `<` characters outside of fenced code blocks
 * so they don't get misinterpreted as JSX by the MDX compiler.
 */
export function sanitizeMdxContent(content: string): string {
  const lines = content.split("\n");
  let inCodeBlock = false;

  return lines
    .map((line) => {
      // Track fenced code block boundaries
      if (line.trimStart().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return line;
      }

      // Leave code block content as-is (MDX handles it correctly)
      if (inCodeBlock) return line;

      // Outside code blocks: escape < that could be misinterpreted as JSX.
      // We replace < with &lt; UNLESS it's inside an inline code span.
      // Strategy: split on inline code spans, only escape in non-code parts.
      const parts = line.split(/(`[^`]*`)/g);
      return parts
        .map((part, i) => {
          // Odd indices are inline code spans — leave them alone
          if (i % 2 === 1) return part;
          // Even indices are regular text — escape bare <
          return part.replace(/</g, "&lt;");
        })
        .join("");
    })
    .join("\n");
}
