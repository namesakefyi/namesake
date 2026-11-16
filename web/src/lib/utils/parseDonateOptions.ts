import { DONATION_FREQUENCIES, type DonateOptions } from "#constants/site-info";

export const parseDonateOptions = (
  searchParams: URLSearchParams,
): DonateOptions => {
  const amount = Number(searchParams.get("amount"));
  const frequency = searchParams.get("frequency");

  return {
    amount: amount > 0 ? amount : undefined,
    frequency: DONATION_FREQUENCIES.find((option) => option === frequency),
  };
};
