/**
 * Given a string, return it with straight quotes, double hyphens, and
 * ellipses converted to their typographic equivalents.
 *
 * @example
 * smartquotes(`"What's up?" -- she said...`)
 * // "“What’s up?” — she said…"
 */
export const smartquotes = (str: string) => {
  return str
    .replace(/(^|[-\u2014\s(["])'/g, "$1\u2018") // opening singles
    .replace(/'/g, "\u2019") // closing singles & apostrophes
    .replace(/(^|[-\u2014/[(\u2018\s])"/g, "$1\u201c") // opening doubles
    .replace(/"/g, "\u201d") // closing doubles
    .replace(/--/g, "\u2014") // em-dashes
    .replace(/\.\.\./g, "\u2026"); // ellipses
};
