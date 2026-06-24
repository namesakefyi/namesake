/**
 * Derives current age from a date-of-birth string (YYYY-MM-DD).
 * Treats the input as a calendar date with no timezone.
 */
export const deriveCurrentAge = (dateOfBirth?: string): number => {
  if (typeof dateOfBirth !== "string" || !dateOfBirth) {
    return 0;
  }

  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) {
    return 0;
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
