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

export const ROLES = {
  user: "User",
  editor: "Editor",
  admin: "Admin",
} as const;

export type Role = keyof typeof ROLES;
