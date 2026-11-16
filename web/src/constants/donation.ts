export type DonationFrequency = "once" | "monthly";

export type DonateOptions = {
  amount?: number;
  frequency?: DonationFrequency;
};

export const donation = {
  nonprofitSlug: "namesake",
  suggestedAmounts: [10, 25, 50, 100],
  primaryColor: "#6E56CF",
  methods: ["card", "bank", "paypal", "venmo", "pay", "daf"],
} as const;
