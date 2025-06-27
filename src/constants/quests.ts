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
  LoaderCircle,
  type LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Zap,
} from "lucide-react";
import { usaStates } from "typed-usa-states";

/**
 * Jurisdictions, a.k.a. US States and territories.
 */
export const JURISDICTIONS = usaStates.reduce(
  (acc, state) => {
    acc[state.abbreviation] = state.name;
    return acc;
  },
  {} as Record<string, string>,
);
export type Jurisdiction = keyof typeof JURISDICTIONS;

export const BIRTHPLACES: Record<Jurisdiction | "other", string> = {
  ...JURISDICTIONS,
  other: "Outside the US",
};
export type Birthplace = keyof typeof BIRTHPLACES;

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

export type CoreCategory =
  | "courtOrder"
  | "socialSecurity"
  | "stateId"
  | "passport"
  | "birthCertificate";

/**
 * Generic group details.
 * Used for UI display of filter groups.
 */
export type GroupDetails = {
  label: string;
  icon: LucideIcon;
  isCore?: boolean;
};

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
} as const;

/**
 * User quest statuses.
 */
export type Status = "notStarted" | "inProgress" | "complete";

interface StatusDetails extends GroupDetails {
  variant?: "warning" | "danger" | "success";
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
  isRequired?: boolean;
};

export const DEFAULT_COSTS: Cost[] = [
  {
    cost: 0,
    description: "",
    isRequired: true,
  },
];

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
} as const;

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
  min: 2,
  max: 6,
  unit: "weeks",
} as const;

/**
 * Getting Started guide details.
 */
export const GETTING_STARTED: GroupDetails = {
  label: "Getting Started",
  icon: Sprout,
  isCore: true,
} as const;
