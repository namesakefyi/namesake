export const formatAddress = (
  street?: string,
  city?: string,
  state?: string,
  zip?: string,
) => {
  return [street, city, state, zip].filter(Boolean).join(", ");
};
