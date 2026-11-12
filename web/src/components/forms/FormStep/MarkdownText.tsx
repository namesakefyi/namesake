import { memo } from "react";
import snarkdown from "snarkdown";
import { escapeHtml } from "#lib/utils/escapeHtml";

/**
 * Escapes the text first, so an answer quoted into a banner can't add
 * markup, and turns each blank-line-separated block into a paragraph or list.
 */
export function markdownToHtml(markdown: string): string {
  return escapeHtml(markdown)
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const html = snarkdown(block);
      return /^\s*([-*]|\d+\.)\s/.test(block) ? html : `<p>${html}</p>`;
    })
    .join("");
}

export const MarkdownText = memo(({ text }: { text: string }) => (
  // biome-ignore lint/security/noDangerouslySetInnerHtml: markdownToHtml escapes the text before converting it
  <div dangerouslySetInnerHTML={{ __html: markdownToHtml(text) }} />
));
