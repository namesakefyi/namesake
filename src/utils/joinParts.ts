export const joinParts = (
  ...parts: (string | undefined)[]
): string | undefined => {
  const result = parts.filter(Boolean).join(", ");
  return result || undefined;
};
