/**
 * Given a date string, return it formatted as MM/DD/YYYY, or an empty
 * string if invalid.
 *
 * @example
 * formatDateMMDDYYYY("1990-06-15")
 * // "06/15/1990"
 */
export const formatDateMMDDYYYY = (date?: string) => {
  if (!date) return "";
  try {
    const dateObject = new Date(date);
    if (dateObject.toString().toLowerCase().includes("invalid")) {
      return "";
    }
    return dateObject.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch (error) {
    console.error("Error formatting date", error);
    return "";
  }
};
