import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { ANNOTATION_TYPES } from "./constants/annotations";
import { COLOR_KEYS } from "./constants/colors";

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    annotation: z.enum(ANNOTATION_TYPES).optional(),
    color: z.enum(COLOR_KEYS).optional(),
  }),
});

export const collections = { pages };
