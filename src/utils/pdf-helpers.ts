export const joinNames = (first?: string, middle?: string, last?: string) => {
  return [first, middle, last].filter(Boolean).join(" ");
};

export const joinPronouns = (pronouns?: string[], otherPronouns?: string) => {
  const pronounList = Array.isArray(pronouns) ? pronouns : [];
  return [...pronounList, otherPronouns].filter(Boolean).join(", ");
};

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
