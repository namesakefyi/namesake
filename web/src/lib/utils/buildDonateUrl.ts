import { type DonateOptions, siteInfo } from "#constants/site-info";

const { donation } = siteInfo;

export const buildDonateUrl = ({ amount, frequency }: DonateOptions = {}) => {
  const url = new URL(`https://www.every.org/${donation.nonprofitSlug}`);
  url.searchParams.set("suggestedAmounts", donation.suggestedAmounts.join(","));
  url.searchParams.set("theme_color", donation.primaryColor.replace("#", ""));
  url.searchParams.set("method", donation.methods.join(","));
  url.searchParams.set("utm_campaign", "donate-link");
  if (amount) url.searchParams.set("amount", String(amount));
  if (frequency) url.searchParams.set("frequency", frequency);
  url.hash = "/donate";
  return url.toString();
};
