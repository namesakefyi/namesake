import { LaptopMinimal, type LucideIcon, Moon, Sun } from "lucide-react";

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

export type ThemeColor =
  | "rainbow"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "turquoise"
  | "indigo"
  | "violet";

export const THEME_COLORS: Record<
  ThemeColor,
  { label: string; meaning?: string }
> = {
  rainbow: {
    label: "Rainbow",
    meaning: "Pride",
  },
  pink: {
    label: "Pink",
    meaning: "Sex",
  },
  red: {
    label: "Red",
    meaning: "Life",
  },
  orange: {
    label: "Orange",
    meaning: "Healing",
  },
  yellow: {
    label: "Yellow",
    meaning: "Sunlight",
  },
  green: {
    label: "Green",
    meaning: "Nature",
  },
  turquoise: {
    label: "Turquoise",
    meaning: "Magic and Art",
  },
  indigo: {
    label: "Indigo",
    meaning: "Serenity",
  },
  violet: {
    label: "Violet",
    meaning: "Spirit",
  },
};

export const ROLES = {
  user: "User",
  editor: "Editor",
  admin: "Admin",
} as const;

export type Role = keyof typeof ROLES;

export const MIN_DISPLAY_NAME_LENGTH = 2;
export const MAX_DISPLAY_NAME_LENGTH = 24;
