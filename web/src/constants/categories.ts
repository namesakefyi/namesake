export const CATEGORIES = {
  "birth-certificate": { name: "Birth Certificate" },
  "court-order": { name: "Court Order" },
  devices: { name: "Devices" },
  education: { name: "Education" },
  entertainment: { name: "Arts and Entertainment" },
  finance: { name: "Finance" },
  gaming: { name: "Gaming" },
  government: { name: "Government" },
  health: { name: "Health" },
  housing: { name: "Housing" },
  other: { name: "Other" },
  passport: { name: "Passport" },
  personal: { name: "Personal" },
  shopping: { name: "Shopping" },
  social: { name: "Social" },
  "social-security": { name: "Social Security" },
  "state-id": { name: "State ID" },
  subscriptions: { name: "Subscriptions" },
  travel: { name: "Travel" },
} as const satisfies Record<string, { name: string }>;

export type CategoryId = keyof typeof CATEGORIES;

export const CATEGORY_OPTIONS = Object.entries(CATEGORIES).map(
  ([id, category]) => ({
    label: category.name,
    value: id,
  }),
);
