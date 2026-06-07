import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
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

const press = defineCollection({
  loader: glob({ base: "./src/content/press", pattern: "**/*.yml" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      outlet: z.string(),
      url: z.url(),
      date: z.date(),
      image: image().optional(),
      imageAlt: z.string().optional(),
    }),
});

const sponsors = defineCollection({
  loader: glob({ base: "./src/content/sponsors", pattern: "**/*.yml" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      url: z.url(),
      logo: image(),
    }),
});

const states = defineCollection({
  loader: file("./src/content/states/states.yml"),
  schema: z.object({
    name: z.string(),
    namesakeSupport: z.enum(["full", "prioritized", "none"]),
  }),
});

export const collections = { pages, press, sponsors, states };
