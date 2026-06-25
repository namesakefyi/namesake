import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { ANNOTATION_TYPES } from "./constants/annotations";
import { CATEGORIES } from "./constants/categories";
import { COLOR_KEYS } from "./constants/colors";
import type { FormConfig } from "./constants/forms";
import { JURISDICTIONS } from "./constants/jurisdictions";
import type { PDFDefinition } from "./constants/pdf";
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
  loader: () =>
    Object.entries(CATEGORIES).map(([id, category]) => ({
      id,
      name: category.name,
    })),
  schema: z.object({
    name: z.string(),
  }),
});

const directory = defineCollection({
  loader: glob({ base: "./src/content/directory", pattern: "**/index.yml" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      jurisdictions: z.array(reference("jurisdictions")),
      url: z.url(),
      services: z.array(
        z.enum(SERVICES.map((s) => s.value) as [string, ...string[]]),
      ),
      officialPartner: z.boolean().default(false),
      email: z.email().optional(),
      phone: z
        .string()
        .regex(/^\d{3}-\d{3}-\d{4}$/)
        .optional(),
      logo: image().optional(),
    }),
});

const forms = defineCollection({
  loader: () => {
    const modules = import.meta.glob<{ default: FormConfig }>(
      "./content/forms/*/index.ts",
      { eager: true },
    );
    return Object.entries(modules).map(([path, module]) => {
      const id =
        path.match(/\.\/content\/forms\/([^/]+)\/index\.ts/)?.[1] ?? "";
      const config = module.default;
      return {
        id,
        title: config.title,
        description: config.description,
        jurisdiction: config.jurisdiction,
        category: config.category,
        costs: config.costs,
        unlisted: config.unlisted ?? false,
      };
    });
  },
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    jurisdiction: reference("jurisdictions").optional(),
    category: reference("categories"),
    unlisted: z.boolean().default(false),
    costs: z
      .array(
        z.object({
          title: z.string(),
          amount: z.number(),
          required: z.enum(["required", "notRequired"]),
        }),
      )
      .optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ base: "./src/content/guides", pattern: "**/*.mdx" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    jurisdiction: reference("jurisdictions").optional(),
    category: reference("categories"),
    stub: z.boolean().default(false),
    unlisted: z.boolean().default(false),
  }),
});

const jurisdictions = defineCollection({
  loader: () =>
    Object.entries(JURISDICTIONS).map(([id, jurisdiction]) => ({
      id,
      name: jurisdiction.name,
      territory: jurisdiction.territory,
      namesakeSupport: jurisdiction.namesakeSupport,
    })),
  schema: z.object({
    name: z.string(),
    territory: z.boolean(),
    namesakeSupport: z.enum(["full", "prioritized", "none"]),
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

const pdfs = defineCollection({
  loader: () => {
    const modules = import.meta.glob<{ default: PDFDefinition }>(
      "./content/pdfs/*/*/index.ts",
      { eager: true },
    );
    return Object.entries(modules).map(([path, module]) => {
      const id = path.match(/\/([^/]+)\/index\.ts$/)?.[1] ?? "";
      const config = module.default;
      return {
        id,
        title: config.title,
        code: config.code,
        jurisdiction: config.jurisdiction,
        canonicalUrl: config.canonicalUrl,
      };
    });
  },
  schema: z.object({
    title: z.string(),
    code: z.string().optional(),
    jurisdiction: reference("jurisdictions").optional(),
    canonicalUrl: z.url(),
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

export const collections = {
  authors,
  categories,
  directory,
  forms,
  guides,
  jurisdictions,
  pages,
  pdfs,
  posts,
  press,
  sponsors,
};
