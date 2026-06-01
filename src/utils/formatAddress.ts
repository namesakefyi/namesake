type Address = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export const formatAddress = ({ street, city, state, zip }: Address) => {
  return [street, city, state, zip].filter(Boolean).join(", ");
};
