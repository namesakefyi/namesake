import { joinParts } from "./joinParts";

type Address = {
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  region?: string;
  zip?: string;
  country?: string;
};

/**
 * Given the parts of a mailing address, return the present ones joined together.
 *
 * @example
 * formatAddress({ street: "123 Main St", city: "Boston", state: "ma", zip: "02108" })
 * // "123 Main St, Boston, MA, 02108"
 */
export const formatAddress = ({
  street,
  street2,
  city,
  state,
  region,
  zip,
  country,
}: Address) => {
  return (
    joinParts(
      street,
      street2,
      city,
      state?.toUpperCase(),
      region,
      zip,
      country,
    ) ?? ""
  );
};
