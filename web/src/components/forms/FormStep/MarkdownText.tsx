import { memo } from "react";
import snarkdown from "snarkdown";

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

/**
 * Converts banner markdown to HTML with snarkdown. The text is escaped
 * first, so an answer quoted into a banner can't add markup, and each
 * blank-line-separated block becomes its own paragraph or list.
 */
export function markdownToHtml(markdown: string): string {
  const escaped = markdown.replace(/[&<>"]/g, (match) => HTML_ESCAPES[match]);
  return escaped
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const html = snarkdown(block);
      return /^\s*([-*]|\d+\.)\s/.test(block) ? html : `<p>${html}</p>`;
    })
    .join("");
}

/** Banner markdown, converted again only when its text changes. */
export const MarkdownText = memo(({ text }: { text: string }) => (
  // biome-ignore lint/security/noDangerouslySetInnerHtml: markdownToHtml escapes the text before converting it
  <div dangerouslySetInnerHTML={{ __html: markdownToHtml(text) }} />
));
