import {
  type RemixiconComponentType,
  RiAccountCircleLine,
  RiAtLine,
  RiBankLine,
  RiCalendarLine,
  RiChat3Line,
  RiCheckboxLine,
  RiComputerLine,
  RiDropdownList,
  RiGamepadLine,
  RiGraduationCapLine,
  RiHashtag,
  RiHeartPulseLine,
  RiHome4Line,
  RiInputField,
  RiMailLine,
  RiMapPinLine,
  RiMovie2Line,
  RiParagraph,
  RiPhoneLine,
  RiQuestionLine,
  RiScales3Line,
  RiShoppingBag4Line,
  RiSignpostLine,
} from "@remixicon/react";

export const JURISDICTIONS = {
  AK: "Alaska",
  AL: "Alabama",
  AR: "Arkansas",
  AZ: "Arizona",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DC: "District of Columbia",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  IA: "Iowa",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  MA: "Massachusetts",
  MD: "Maryland",
  ME: "Maine",
  MI: "Michigan",
  MN: "Minnesota",
  MO: "Missouri",
  MS: "Mississippi",
  MT: "Montana",
  NC: "North Carolina",
  ND: "North Dakota",
  NE: "Nebraska",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NV: "Nevada",
  NY: "New York",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VA: "Virginia",
  VT: "Vermont",
  WA: "Washington",
  WI: "Wisconsin",
  WV: "West Virginia",
  WY: "Wyoming",
} as const;
export type Jurisdiction = keyof typeof JURISDICTIONS;

interface FieldDetails {
  label: string;
  icon: RemixiconComponentType;
}
export const FIELDS: Record<string, FieldDetails> = {
  text: {
    label: "Text",
    icon: RiInputField,
  },
  textarea: {
    label: "Textarea",
    icon: RiParagraph,
  },
  date: {
    label: "Date",
    icon: RiCalendarLine,
  },
  select: {
    label: "Select",
    icon: RiDropdownList,
  },
  checkbox: {
    label: "Checkbox",
    icon: RiCheckboxLine,
  },
  number: {
    label: "Number",
    icon: RiHashtag,
  },
  email: {
    label: "Email",
    icon: RiAtLine,
  },
  phone: {
    label: "Phone",
    icon: RiPhoneLine,
  },
} as const;
export type Field = keyof typeof FIELDS;

export const THEMES = {
  system: "System",
  light: "Light",
  dark: "Dark",
} as const;
export type Theme = keyof typeof THEMES;

export const ROLES = {
  user: "User",
  editor: "Editor",
  admin: "Admin",
} as const;
export type Role = keyof typeof ROLES;

export const SORT_QUESTS_BY = {
  newest: "Newest",
  oldest: "Oldest",
} as const;
export type SortQuestsBy = keyof typeof SORT_QUESTS_BY;

interface CategoryDetails {
  label: string;
  icon: RemixiconComponentType;
}
export const CATEGORIES: Record<string, CategoryDetails> = {
  core: {
    label: "Core",
    icon: RiSignpostLine,
  },
  entertainment: {
    label: "Arts and Entertainment",
    icon: RiMovie2Line,
  },
  devices: {
    label: "Devices",
    icon: RiComputerLine,
  },
  education: {
    label: "Education",
    icon: RiGraduationCapLine,
  },
  finance: {
    label: "Finance",
    icon: RiBankLine,
  },
  gaming: {
    label: "Gaming",
    icon: RiGamepadLine,
  },
  government: {
    label: "Government",
    icon: RiScales3Line,
  },
  health: {
    label: "Health",
    icon: RiHeartPulseLine,
  },
  housing: {
    label: "Housing and Utilities",
    icon: RiHome4Line,
  },
  personal: {
    label: "Personal",
    icon: RiAccountCircleLine,
  },
  shopping: {
    label: "Shopping",
    icon: RiShoppingBag4Line,
  },
  social: {
    label: "Social",
    icon: RiChat3Line,
  },
  subscriptions: {
    label: "Subscriptions",
    icon: RiMailLine,
  },
  travel: {
    label: "Travel",
    icon: RiMapPinLine,
  },
  other: {
    label: "Other",
    icon: RiQuestionLine,
  },
};
export type Category = keyof typeof CATEGORIES;
