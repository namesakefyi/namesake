/**
 * Joins non-empty string parts with a comma, or returns undefined if none are present.
 *
 * @example
 * joinParts("Boston", "MA")
 * // "Boston, MA"
 * joinParts(undefined, undefined)
 * // undefined
 */
export const joinParts = (
  ...parts: (string | undefined)[]
): string | undefined => {
  const result = parts.filter(Boolean).join(", ");
  return result || undefined;
};
