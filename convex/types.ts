import type { Infer } from "convex/values";
import type { role, theme } from "./validators";

export type Theme = Infer<typeof theme>;
export type Role = Infer<typeof role>;
