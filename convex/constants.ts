import {
  Calendar,
  Calendar1,
  CalendarClock,
  CalendarDays,
  CircleArrowRight,
  CircleCheckBig,
  CircleDashed,
  CircleHelp,
  CircleUser,
  Clapperboard,
  Clock,
  Computer,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  History,
  House,
  Landmark,
  LaptopMinimal,
  LayoutList,
  ListChecks,
  LoaderCircle,
  type LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  Milestone,
  Moon,
  Scale,
  ShoppingBag,
  Sun,
  Text,
  TextCursorInput,
  UserPen,
  Zap,
} from "lucide-react";

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
  icon: LucideIcon;
}

export type Theme = "system" | "light" | "dark";
export const THEMES: Record<Theme, FieldDetails> = {
  system: {
    label: "System",
    icon: LaptopMinimal,
  },
  light: {
    label: "Light",
    icon: Sun,
  },
  dark: {
    label: "Dark",
    icon: Moon,
  },
} as const;

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
} as const;
export type GroupQuestsBy = keyof typeof GROUP_QUESTS_BY;

/**
 * Generic group details.
 * Used for UI display of filter groups.
 */
export type GroupDetails = {
  label: string;
  icon: LucideIcon;
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
    icon: Milestone,
  },
  entertainment: {
    label: "Arts and Entertainment",
    icon: Clapperboard,
  },
  devices: {
    label: "Devices",
    icon: Computer,
  },
  education: {
    label: "Education",
    icon: GraduationCap,
  },
  finance: {
    label: "Finance",
    icon: Landmark,
  },
  gaming: {
    label: "Gaming",
    icon: Gamepad2,
  },
  government: {
    label: "Government",
    icon: Scale,
  },
  health: {
    label: "Health",
    icon: HeartPulse,
  },
  housing: {
    label: "Housing and Utilities",
    icon: House,
  },
  personal: {
    label: "Personal",
    icon: CircleUser,
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
  },
  social: {
    label: "Social",
    icon: MessageCircle,
  },
  subscriptions: {
    label: "Subscriptions",
    icon: Mail,
  },
  travel: {
    label: "Travel",
    icon: MapPin,
  },
  other: {
    label: "Other",
    icon: CircleHelp,
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
    icon: Calendar,
  },
  lastMonth: {
    label: "Last 30 days",
    icon: CalendarDays,
  },
  earlier: {
    label: "Earlier",
    icon: History,
  },
};

export const DATE_ADDED_ORDER: DateAdded[] = Object.keys(
  DATE_ADDED,
) as DateAdded[];

/**
 * User quest statuses.
 * "filed" is only available for core quests.
 * "notStarted", "inProgress", and "complete" are available for all quests.
 */
export type Status = "notStarted" | "inProgress" | "filed" | "complete";

interface StatusDetails extends GroupDetails {
  variant?: "info" | "warning" | "danger" | "waiting" | "success";
  isCoreOnly?: boolean;
}

export const STATUS: Record<Status, StatusDetails> = {
  notStarted: {
    label: "Not started",
    icon: CircleDashed,
  },
  inProgress: {
    label: "In progress",
    icon: LoaderCircle,
    variant: "warning",
  },
  filed: {
    label: "Filed",
    icon: CircleArrowRight,
    isCoreOnly: true,
    variant: "waiting",
  },
  complete: {
    label: "Done",
    icon: CircleCheckBig,
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
    icon: Zap,
  },
  hours: {
    label: "Hours",
    icon: Clock,
  },
  days: {
    label: "Days",
    icon: Calendar,
  },
  weeks: {
    label: "Weeks",
    icon: CalendarDays,
  },
  months: {
    label: "Months",
    icon: CalendarClock,
  },
};

export const TIME_UNITS_ORDER: TimeUnit[] = Object.keys(
  TIME_UNITS,
) as TimeUnit[];

export type TimeRequired = {
  min: number;
  max: number;
  unit: TimeUnit;
  description?: string;
};

export const DEFAULT_TIME_REQUIRED: TimeRequired = {
  min: 5,
  max: 10,
  unit: "minutes",
};

type FormFieldDetails = {
  label: string;
  description: string;
  icon: LucideIcon;
};

export type FormField =
  | "address"
  | "checkboxGroup"
  | "email"
  | "longText"
  | "memorableDate"
  | "name"
  | "radioGroup"
  | "shortText";

export const FORM_FIELDS: Record<FormField, FormFieldDetails> = {
  address: {
    label: "Address",
    description:
      "Fields for a full address, including street, city, state, and ZIP.",
    icon: MapPin,
  },
  checkboxGroup: {
    label: "Checkbox Group",
    description:
      "A group of checkboxes which allows a user to select one or more options.",
    icon: ListChecks,
  },
  email: {
    label: "Email",
    description: "A field for an email address.",
    icon: Mail,
  },
  longText: {
    label: "Long Text",
    description: "A field for a long text entry.",
    icon: Text,
  },
  memorableDate: {
    label: "Memorable Date",
    description: "A field for a memorable date such as a birthday.",
    icon: Calendar1,
  },
  name: {
    label: "Full Name",
    description: "Fields for first, middle, and last name.",
    icon: UserPen,
  },
  radioGroup: {
    label: "Radio Group",
    description:
      "A group of radio buttons which allows a user to select one option.",
    icon: LayoutList,
  },
  shortText: {
    label: "Short Text",
    description: "A field for a short text entry.",
    icon: TextCursorInput,
  },
};
