import { v } from "convex/values";
import {
  FIELDS,
  type Field,
  ICONS,
  JURISDICTIONS,
  ROLES,
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

export const icon = v.union(
  ...Object.keys(ICONS).map((icon) => v.literal(icon)),
);

const sharedFieldProps = {
  label: v.string(),
  helpText: v.optional(v.string()),
  isRequired: v.boolean(),
};

const optionsForField: any = (field: Field) => {
  switch (field) {
    case "select":
      return {
        options: v.array(v.string()),
      };
    case "number":
      return {
        min: v.optional(v.number()),
        max: v.optional(v.number()),
      };
    case "text":
    case "textarea":
      return {
        minLength: v.optional(v.number()),
        maxLength: v.optional(v.number()),
      };
    default:
      return {};
  }
};

export const field = v.union(
  ...Object.keys(FIELDS).map((field) =>
    v.object({
      type: v.literal(field),
      ...sharedFieldProps,
      ...optionsForField(field as keyof typeof FIELDS),
    }),
  ),
);
