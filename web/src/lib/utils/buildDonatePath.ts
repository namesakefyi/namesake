import { type DonateOptions, siteInfo } from "#constants/site-info";

export const buildDonatePath = ({ amount, frequency }: DonateOptions = {}) => {
  const searchParams = new URLSearchParams();
  if (amount) searchParams.set("amount", String(amount));
  if (frequency) searchParams.set("frequency", frequency);

  const query = searchParams.toString();
  return query ? `${siteInfo.urls.donate}?${query}` : siteInfo.urls.donate;
};
