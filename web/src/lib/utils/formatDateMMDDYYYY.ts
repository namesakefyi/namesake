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
