/**
 * Given string parts, return the non-empty ones joined with a comma,
 * or undefined if none are present.
 *
 * @example
 * joinParts("Boston", "MA")
 * // "Boston, MA"
 */
export const joinParts = (
  ...parts: (string | undefined)[]
): string | undefined => {
  const result = parts.filter(Boolean).join(", ");
  return result || undefined;
};
