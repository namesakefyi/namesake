export const joinPronouns = (pronouns?: string[], otherPronouns?: string) => {
  const pronounList = Array.isArray(pronouns) ? pronouns : [];
  return [
    ...pronounList.filter((p) => p.toLowerCase() !== "other"),
    otherPronouns,
  ]
    .filter(Boolean)
    .join(", ");
};
