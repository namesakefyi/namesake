import type { MarkdownHeading } from "astro";
import type { Block } from "astro-portabletext/types";
import { generateSlug } from "./generateSlug";
import { getChildrenText } from "./getChildrenText";

/**
 * Extract headings from Sanity content.
 */
export function extractHeadings(content: unknown): MarkdownHeading[] {
  if (content == null || !Array.isArray(content)) return [];

  return (content as Block[])
    .filter((block) => block.style && /^h[1-6]$/.test(block.style))
    .map((block) => {
      const text = getChildrenText(block);
      const slug = generateSlug(text);
      const depth = Number.parseInt(block.style.charAt(1), 10) as
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6;

      return {
        depth,
        slug,
        text,
      };
    });
}
