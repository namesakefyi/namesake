import { v } from "convex/values";
import { JURISDICTIONS } from "./constants";

export const jurisdiction = v.union(
  ...Object.keys(JURISDICTIONS).map((jurisdiction) => v.literal(jurisdiction)),
);

export const theme = v.union(
  v.literal("system"),
  v.literal("light"),
  v.literal("dark"),
);

export const role = v.union(
  v.literal("user"),
  v.literal("editor"),
  v.literal("admin"),
);
