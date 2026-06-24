/**
 * Joins selected pronouns into a single string, substituting otherPronouns
 * in place of the "other" option.
 *
 * @example
 * joinPronouns(["she/her", "they/them"])
 * // "she/her, they/them"
 * joinPronouns(["other"], "ze/zir")
 * // "ze/zir"
 */
export const joinPronouns = (pronouns?: string[], otherPronouns?: string) => {
  const pronounList = Array.isArray(pronouns) ? pronouns : [];
  return [
    ...pronounList.filter((p) => p.toLowerCase() !== "other"),
    otherPronouns,
  ]
    .filter(Boolean)
    .join(", ");
};
