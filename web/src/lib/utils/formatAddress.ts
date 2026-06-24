type Address = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
};

/**
 * Given the parts of a mailing address, return the present ones joined together.
 *
 * @example
 * formatAddress({ street: "123 Main St", city: "Boston", state: "MA", zip: "02108" })
 * // "123 Main St, Boston, MA, 02108"
 */
export const formatAddress = ({ street, city, state, zip }: Address) => {
  return [street, city, state, zip].filter(Boolean).join(", ");
};
