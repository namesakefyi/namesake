import { COLORS } from "#constants/colors";

export const DONATION_FREQUENCIES = ["once", "monthly"] as const;

export type DonationFrequency = (typeof DONATION_FREQUENCIES)[number];

export type DonateOptions = {
  amount?: number;
  frequency?: DonationFrequency;
};

export const donation = {
  path: "/donate",
  nonprofitSlug: "namesake",
  suggestedAmounts: [10, 25, 50, 100],
  primaryColor: COLORS.black.hex,
  methods: ["card", "bank", "paypal", "venmo", "pay", "daf"],
} as const;
