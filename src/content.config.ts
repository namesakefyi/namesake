import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { ANNOTATION_TYPES } from "./constants/annotations";
import { COLOR_KEYS } from "./constants/colors";
import { SERVICES } from "./constants/services";

const authors = defineCollection({
  loader: glob({ base: "./src/content/authors", pattern: "**/index.yml" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      avatar: image(),
      socialLinks: z
        .array(
          z.object({
            name: z.string(),
            url: z.url(),
          }),
        )
        .optional(),
    }),
});

const categories = defineCollection({
  loader: file("./src/content/categories/categories.yml"),
  schema: z.object({
    name: z.string(),
  }),
});

const contacts = defineCollection({
  loader: glob({ base: "./src/content/contacts", pattern: "**/index.yml" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      states: z.array(reference("states")),
      url: z.url(),
      services: z.array(
        z.enum(SERVICES.map((s) => s.value) as [string, ...string[]]),
      ),
      officialPartner: z.boolean().default(false),
      email: z.email().optional(),
      phone: z.string().optional(),
      logo: image().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    annotation: z.enum(ANNOTATION_TYPES).optional(),
    color: z.enum(COLOR_KEYS).optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/index.mdx" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      showDescription: z.boolean().default(true),
      publishDate: z.date(),
      annotation: z.enum(ANNOTATION_TYPES).optional(),
      authors: z.array(z.string()).optional(),
      image: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
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
      image: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
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

export const collections = {
  authors,
  categories,
  contacts,
  pages,
  posts,
  press,
  sponsors,
  states,
};
