import { type DonateOptions, siteInfo } from "#constants/site-info";

const { donation } = siteInfo;

const setDonateParams = (
  searchParams: URLSearchParams,
  { amount, frequency }: DonateOptions,
) => {
  if (amount) searchParams.set("amount", String(amount));
  if (frequency) searchParams.set("frequency", frequency);
};

export const buildDonatePath = (options: DonateOptions = {}) => {
  const searchParams = new URLSearchParams();
  setDonateParams(searchParams, options);

  const query = searchParams.toString();
  return query ? `${siteInfo.urls.donate}?${query}` : siteInfo.urls.donate;
};

export const buildEveryOrgUrl = (options: DonateOptions = {}) => {
  const url = new URL(`https://www.every.org/${donation.nonprofitSlug}`);
  url.searchParams.set("suggestedAmounts", donation.suggestedAmounts.join(","));
  url.searchParams.set("theme_color", donation.primaryColor.replace("#", ""));
  url.searchParams.set("method", donation.methods.join(","));
  url.searchParams.set("utm_campaign", "donate-link");
  setDonateParams(url.searchParams, options);
  url.hash = "/donate";
  return url.toString();
};
