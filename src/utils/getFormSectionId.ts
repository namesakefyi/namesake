/**
 * Given a question string, returns an #id attribute which can be used to
 * link to that section within the form.
 * @param question The question title.
 * @example "What's your current legal name?"
 * @returns The id attribute.
 * @example "whats-your-current-legal-name"
 */
export function getFormSectionId(question: string) {
  let sanitizedQuestion = question;
  // Trim whitespace
  sanitizedQuestion = sanitizedQuestion.trim();
  // Replace German eszett with 'ss'
  sanitizedQuestion = sanitizedQuestion.replace(/ß/g, "ss");
  // Convert special characters to their canonical equivalents
  sanitizedQuestion = sanitizedQuestion.normalize("NFKD");
  // Remove punctuation except hyphens
  sanitizedQuestion = sanitizedQuestion.replace(/[^\w\s-]/g, "");
  // Replace multiple spaces or hyphens with a single hyphen
  sanitizedQuestion = sanitizedQuestion.replace(/[\s-]+/g, "-");

  return encodeURIComponent(sanitizedQuestion.toLowerCase());
}
