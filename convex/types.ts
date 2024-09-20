import type { Infer } from "convex/values";
import type { jurisdiction, role, theme } from "./validators";

export type Jurisdiction = Infer<typeof jurisdiction>;
export type Theme = Infer<typeof theme>;
export type Role = Infer<typeof role>;
