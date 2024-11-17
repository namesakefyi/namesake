import {
  type RemixiconComponentType,
  RiAccountCircleLine,
  RiAtLine,
  RiBankLine,
  RiCalendar2Line,
  RiCalendarLine,
  RiCalendarScheduleLine,
  RiChat3Line,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiCheckboxLine,
  RiComputerLine,
  RiDropdownList,
  RiFlashlightLine,
  RiFolderCheckLine,
  RiFolderLine,
  RiGamepadLine,
  RiGraduationCapLine,
  RiHashtag,
  RiHeartPulseLine,
  RiHistoryLine,
  RiHome4Line,
  RiInputField,
  RiMailLine,
  RiMapPinLine,
  RiMovie2Line,
  RiParagraph,
  RiPhoneLine,
  RiProgress4Line,
  RiQuestionLine,
  RiScales3Line,
  RiShoppingBag4Line,
  RiSignpostLine,
  RiTimeLine,
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

/**
 * Fields for input forms.
 */
interface FieldDetails {
  label: string;
  icon: RemixiconComponentType;
}

export type Field =
  | "text"
  | "textarea"
  | "date"
  | "select"
  | "checkbox"
  | "number"
  | "email"
  | "phone";

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

export const GROUP_QUESTS_BY = {
  dateAdded: "Date added",
  category: "Category",
  status: "Status",
  timeRequired: "Time required",
} as const;
export type GroupQuestsBy = keyof typeof GROUP_QUESTS_BY;

/**
 * Generic group details.
 * Used for UI display of filter groups.
 */
export type GroupDetails = {
  label: string;
  icon: RemixiconComponentType;
};

/**
 * Categories.
 * Used to filter quests in the quests list.
 */
export type Category =
  | "core"
  | "entertainment"
  | "devices"
  | "education"
  | "finance"
  | "gaming"
  | "government"
  | "health"
  | "housing"
  | "personal"
  | "shopping"
  | "social"
  | "subscriptions"
  | "travel"
  | "other";

export const CATEGORIES: Record<Category, GroupDetails> = {
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

export const CATEGORY_ORDER: Category[] = Object.keys(CATEGORIES) as Category[];

/**
 * Date added filters.
 * Used to filter quests in the quests list.
 */
export type DateAdded = "lastWeek" | "lastMonth" | "earlier";

export const DATE_ADDED: Record<DateAdded, GroupDetails> = {
  lastWeek: {
    label: "Last 7 days",
    icon: RiTimeLine,
  },
  lastMonth: {
    label: "Last 30 days",
    icon: RiCalendarLine,
  },
  earlier: {
    label: "Earlier",
    icon: RiHistoryLine,
  },
};

export const DATE_ADDED_ORDER: DateAdded[] = Object.keys(
  DATE_ADDED,
) as DateAdded[];

/**
 * User quest statuses.
 * "readyToFile" and "filed" are only available for core quests.
 * "notStarted", "inProgress", and "complete" are available for all quests.
 */
export type Status =
  | "notStarted"
  | "inProgress"
  | "readyToFile"
  | "filed"
  | "complete";

interface StatusDetails extends GroupDetails {
  variant?: "info" | "success" | "danger" | "warning" | "waiting";
  isCoreOnly?: boolean;
}

export const STATUS: Record<Status, StatusDetails> = {
  notStarted: {
    label: "Not started",
    icon: RiCheckboxBlankCircleLine,
  },
  inProgress: {
    label: "In progress",
    icon: RiProgress4Line,
    variant: "warning",
  },
  readyToFile: {
    label: "Ready to file",
    icon: RiFolderLine,
    isCoreOnly: true,
    variant: "info",
  },
  filed: {
    label: "Filed",
    icon: RiFolderCheckLine,
    isCoreOnly: true,
    variant: "waiting",
  },
  complete: {
    label: "Completed",
    icon: RiCheckboxCircleFill,
    variant: "success",
  },
} as const;

export const STATUS_ORDER: Status[] = Object.keys(STATUS) as Status[];

export type Cost = {
  cost: number;
  description: string;
};

/**
 * Time units.
 * Used to display time required in quest details.
 */
export type TimeUnit = "minutes" | "hours" | "days" | "weeks" | "months";

export const TIME_UNITS: Record<TimeUnit, GroupDetails> = {
  minutes: {
    label: "Minutes",
    icon: RiFlashlightLine,
  },
  hours: {
    label: "Hours",
    icon: RiTimeLine,
  },
  days: {
    label: "Days",
    icon: RiCalendarLine,
  },
  weeks: {
    label: "Weeks",
    icon: RiCalendar2Line,
  },
  months: {
    label: "Months",
    icon: RiCalendarScheduleLine,
  },
};

export const TIME_UNITS_ORDER: TimeUnit[] = Object.keys(
  TIME_UNITS,
) as TimeUnit[];

export type TimeRequired = {
  min: number;
  max: number;
  unit: TimeUnit;
};

export const DEFAULT_TIME_REQUIRED: TimeRequired = {
  min: 5,
  max: 10,
  unit: "minutes",
};
