/**
 * Given a date-of-birth string (YYYY-MM-DD), return the current age.
 * Treats the input as a calendar date with no timezone.
 *
 * @example
 * deriveCurrentAge("1990-06-15") // assuming today is 2026-06-24
 * // 36
 */
export const deriveCurrentAge = (dateOfBirth?: string): number | undefined => {
  if (typeof dateOfBirth !== "string" || !dateOfBirth) return undefined;

  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return undefined;

  const elapsed = new Date(Date.now() - birth.getTime());
  return elapsed.getUTCFullYear() - new Date(0).getUTCFullYear();
};
