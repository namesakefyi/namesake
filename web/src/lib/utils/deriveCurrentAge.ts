/**
 * Derives current age from a date-of-birth string (YYYY-MM-DD).
 * Treats the input as a calendar date with no timezone.
 */
export const deriveCurrentAge = (dateOfBirth?: string): number | undefined => {
  if (typeof dateOfBirth !== "string" || !dateOfBirth) {
    return undefined;
  }

  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) {
    return undefined;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  const hasBirthdayOccurredThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());

  if (!hasBirthdayOccurredThisYear) age -= 1;

  return age;
};
