import { v } from "convex/values";
import {
  CATEGORIES,
  ESTIMATED_TIME_UNITS,
  FIELDS,
  GROUP_QUESTS_BY,
  JURISDICTIONS,
  ROLES,
  STATUS,
  THEMES,
} from "./constants";

export const jurisdiction = v.union(
  ...Object.keys(JURISDICTIONS).map((jurisdiction) => v.literal(jurisdiction)),
);

export const status = v.union(
  ...Object.keys(STATUS).map((status) => v.literal(status)),
);

export const theme = v.union(
  ...Object.keys(THEMES).map((theme) => v.literal(theme)),
);

export const role = v.union(
  ...Object.keys(ROLES).map((role) => v.literal(role)),
);

export const field = v.union(
  ...Object.keys(FIELDS).map((field) => v.literal(field)),
);

export const groupQuestsBy = v.union(
  ...Object.keys(GROUP_QUESTS_BY).map((groupQuestsBy) =>
    v.literal(groupQuestsBy),
  ),
);

export const category = v.union(
  ...Object.keys(CATEGORIES).map((category) => v.literal(category)),
);

export const timeRequiredUnit = v.union(
  ...Object.keys(ESTIMATED_TIME_UNITS).map((unit) => v.literal(unit)),
);
