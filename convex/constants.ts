import {
  Calendar,
  CalendarClock,
  CalendarDays,
  CircleCheckBig,
  CircleDashed,
  CircleHelp,
  CircleUser,
  Clapperboard,
  Clock,
  Computer,
  FileBadge,
  Gamepad2,
  Gavel,
  Globe,
  GraduationCap,
  HeartPulse,
  House,
  IdCard,
  Landmark,
  LaptopMinimal,
  LoaderCircle,
  type LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  Moon,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sun,
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

export const BIRTHPLACES = {
  ...JURISDICTIONS,
  other: "I was born outside the US",
};
export type Birthplace = keyof typeof BIRTHPLACES;

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

/**
 * Generic group details.
 * Used for UI display of filter groups.
 */
export type GroupDetails = {
  label: string;
  icon: LucideIcon;
  isCore?: boolean;
};

/**
 * Categories.
 * Used to filter quests in the quests list.
 */
export type Category =
  // Core Types
  | "courtOrder"
  | "stateId"
  | "socialSecurity"
  | "passport"
  | "birthCertificate"

  // Non-Core Types
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

export type CoreCategory = keyof Pick<
  typeof CATEGORIES,
  "courtOrder" | "stateId" | "socialSecurity" | "passport" | "birthCertificate"
>;

export const CATEGORIES: Record<Category, GroupDetails> = {
  courtOrder: {
    label: "Court Order",
    icon: Gavel,
    isCore: true,
  },
  socialSecurity: {
    label: "Social Security",
    icon: ShieldCheck,
    isCore: true,
  },
  stateId: {
    label: "State ID",
    icon: IdCard,
    isCore: true,
  },
  passport: {
    label: "Passport",
    icon: Globe,
    isCore: true,
  },
  birthCertificate: {
    label: "Birth Certificate",
    icon: FileBadge,
    isCore: true,
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

/**
 * User quest statuses.
 */
export type Status = "notStarted" | "inProgress" | "complete";

interface StatusDetails extends GroupDetails {
  variant?: "info" | "warning" | "danger" | "waiting" | "success";
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

export const COMMON_PRONOUNS = ["they/them", "she/her", "he/him"];

// Used for React-Aria's Selection.
// https://react-spectrum.adobe.com/react-aria/selection.html#select-all
export const ALL = "all";

type FieldDefinition = {
  label: string;
  type: "boolean" | "string" | "string[]";
};

export const USER_FORM_DATA_FIELDS: Record<string, FieldDefinition> = {
  oldFirstName: {
    label: "Old first name",
    type: "string",
  },
  oldMiddleName: {
    label: "Old middle name",
    type: "string",
  },
  oldLastName: {
    label: "Old last name",
    type: "string",
  },
  newFirstName: {
    label: "New first name",
    type: "string",
  },
  newMiddleName: {
    label: "New middle name",
    type: "string",
  },
  newLastName: {
    label: "New last name",
    type: "string",
  },
  reasonForChangingName: {
    label: "Reason for changing name",
    type: "string",
  },
  phoneNumber: {
    label: "Phone number",
    type: "string",
  },
  email: {
    label: "Email",
    type: "string",
  },
  dateOfBirth: {
    label: "Date of birth",
    type: "string",
  },
  isCurrentlyUnhoused: {
    label: "Currently unhoused?",
    type: "boolean",
  },
  residenceStreetAddress: {
    label: "Residence street address",
    type: "string",
  },
  residenceCity: {
    label: "Residence city",
    type: "string",
  },
  residenceState: {
    label: "Residence state",
    type: "string",
  },
  residenceZipCode: {
    label: "Residence zip code",
    type: "string",
  },
  isMailingAddressDifferentFromResidence: {
    label: "Mailing address different from residence?",
    type: "boolean",
  },
  mailingStreetAddress: {
    label: "Mailing street address",
    type: "string",
  },
  mailingCity: {
    label: "Mailing city",
    type: "string",
  },
  mailingState: {
    label: "Mailing state",
    type: "string",
  },
  mailingZipCode: {
    label: "Mailing zip code",
    type: "string",
  },
  hasPreviousNameChange: {
    label: "Has previous name change?",
    type: "boolean",
  },
  previousLegalNames: {
    label: "Previous legal names",
    type: "string",
  },
  isInterpreterNeeded: {
    label: "Interpreter needed?",
    type: "boolean",
  },
  language: {
    label: "Language",
    type: "string",
  },
  isOkayToSharePronouns: {
    label: "Okay to share pronouns?",
    type: "boolean",
  },
  pronouns: {
    label: "Pronouns",
    type: "string[]",
  },
  otherPronouns: {
    label: "Other pronouns",
    type: "string",
  },
  shouldReturnOriginalDocuments: {
    label: "Return original documents?",
    type: "boolean",
  },
  shouldWaivePublicationRequirement: {
    label: "Waive publication requirement?",
    type: "boolean",
  },
  shouldImpoundCourtRecords: {
    label: "Impound court records?",
    type: "boolean",
  },
  shouldApplyForFeeWaiver: {
    label: "Apply for a fee waiver?",
    type: "boolean",
  },
  mothersMaidenName: {
    label: "Mother's maiden name",
    type: "string",
  },
} as const;

export type UserFormDataField = keyof typeof USER_FORM_DATA_FIELDS;

export type FieldType<K extends UserFormDataField> = {
  boolean: boolean;
  "string[]": string[];
  string: string;
}[(typeof USER_FORM_DATA_FIELDS)[K]["type"]];
