const pluralRules = new Intl.PluralRules("en-US");

/**
 * Given a count and the singular form of a word, return the singular or
 * plural form that matches the count. Defaults to adding an "s" for the
 * plural form, but an explicit plural can be passed for irregular words.
 *
 * @example
 * pluralize(1, "document")
 * // "document"
 * pluralize(3, "document")
 * // "documents"
 * pluralize(3, "person", "people")
 * // "people"
 */
export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return pluralRules.select(count) === "one" ? singular : plural;
}
