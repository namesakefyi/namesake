import { v } from "convex/values";
import {
  CATEGORIES,
  FIELDS,
  JURISDICTIONS,
  ROLES,
  SORT_QUESTS_BY,
  THEMES,
} from "./constants";

export const jurisdiction = v.union(
  ...Object.keys(JURISDICTIONS).map((jurisdiction) => v.literal(jurisdiction)),
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

export const sortQuestsBy = v.union(
  ...Object.keys(SORT_QUESTS_BY).map((sortQuestsBy) => v.literal(sortQuestsBy)),
);

export const category = v.union(
  ...Object.keys(CATEGORIES).map((category) => v.literal(category)),
);
