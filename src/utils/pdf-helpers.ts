export const joinNames = (first?: string, middle?: string, last?: string) => {
  return [first, middle, last].filter(Boolean).join(" ");
};

export const joinPronouns = (pronouns?: string[], otherPronouns?: string) => {
  const pronounList = Array.isArray(pronouns) ? pronouns : [];
  return [...pronounList, otherPronouns].filter(Boolean).join(", ");
};
