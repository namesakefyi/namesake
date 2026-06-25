/**
 * Given individual first/middle/last names, return a full name string.
 *
 * @example
 * joinNames("Marsha", "P", "Johnson")
 * // "Marsha P Johnson"
 */
export const joinNames = (first?: string, middle?: string, last?: string) => {
  return [first, middle, last].filter(Boolean).join(" ");
};
