import { type Infer, v } from "convex/values";
import { JURISDICTIONS } from "./constants";

export type Jurisdiction = Infer<typeof jurisdiction>;
export const jurisdiction = v.union(
  ...Object.keys(JURISDICTIONS).map((jurisdiction) => v.literal(jurisdiction)),
);

export type Theme = Infer<typeof theme>;
export const theme = v.union(
  v.literal("system"),
  v.literal("light"),
  v.literal("dark"),
);

export type Role = Infer<typeof role>;
export const role = v.union(
  v.literal("user"),
  v.literal("editor"),
  v.literal("admin"),
);
