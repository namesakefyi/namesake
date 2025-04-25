export function getFormQuestionHash(question: string) {
  let sanitizedQuestion = question;
  // Remove trailing punctuation
  sanitizedQuestion = sanitizedQuestion.replace(/[^\w\s]/g, "");
  // Remove apostrophes
  sanitizedQuestion = sanitizedQuestion.replace(/'/g, "");

  return encodeURIComponent(sanitizedQuestion.toLowerCase().replace(/ /g, "-"));
}
