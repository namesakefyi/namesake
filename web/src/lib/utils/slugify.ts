/**
 * Given a string, returns a lowercase, kebab-case slug.
 *
 * @example
 * slugify("What's your legal name?") -> "whats-your-legal-name"
 */
export function slugify(input: string) {
  return input
    .trim()
    .replace(/ß/g, "ss") // Replace German eszett with 'ss'
    .normalize("NFKD") // Convert special characters to their canonical equivalents
    .replace(/[^\w\s-]/g, "") // Remove punctuation except hyphens
    .replace(/[\s-]+/g, "-") // Collapse whitespace/hyphens into a single hyphen
    .toLowerCase();
}
