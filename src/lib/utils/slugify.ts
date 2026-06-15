/**
 * Given a string, returns a slug.
 * @param input The string to slugify.
 * @example "What's your current legal name?"
 * @returns The slug.
 * @example "whats-your-current-legal-name-in-the-state-of-massachusetts"
 */
export function slugify(input: string) {
  let sanitizedInput = input;
  // Trim whitespace
  sanitizedInput = sanitizedInput.trim();
  // Replace German eszett with 'ss'
  sanitizedInput = sanitizedInput.replace(/ß/g, "ss");
  // Convert special characters to their canonical equivalents
  sanitizedInput = sanitizedInput.normalize("NFKD");
  // Remove punctuation except hyphens
  sanitizedInput = sanitizedInput.replace(/[^\w\s-]/g, "");
  // Replace multiple spaces or hyphens with a single hyphen
  sanitizedInput = sanitizedInput.replace(/[\s-]+/g, "-");

  return encodeURIComponent(sanitizedInput.toLowerCase());
}
