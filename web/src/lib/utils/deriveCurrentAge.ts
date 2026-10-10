/**
 * Given a date-of-birth string (YYYY-MM-DD), return the current age.
 * Treats the input as a calendar date with no timezone.
 * If the age is unknown, returns -1.
 *
 * @example
 * deriveCurrentAge("1990-06-15") // assuming today is 2026-06-24
 * // 36
 */
export const deriveCurrentAge = (dateOfBirth?: string): number => {
  if (typeof dateOfBirth !== "string" || !dateOfBirth) return -1;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return -1;
  const birth = new Date(`${dateOfBirth}T00:00:00Z`);
  if (
    Number.isNaN(birth.getTime()) ||
    birth.toISOString().slice(0, 10) !== dateOfBirth
  )
    return -1;

  const today = new Date();
  const birthdayHasPassed =
    today.getMonth() > birth.getUTCMonth() ||
    (today.getMonth() === birth.getUTCMonth() &&
      today.getDate() >= birth.getUTCDate());
  const age =
    today.getFullYear() - birth.getUTCFullYear() - (birthdayHasPassed ? 0 : 1);
  return age >= 0 ? age : -1;
};
