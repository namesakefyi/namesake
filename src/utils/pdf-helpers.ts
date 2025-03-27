export const joinNames = (first?: string, middle?: string, last?: string) => {
  return [first, middle, last].filter(Boolean).join(" ");
};
