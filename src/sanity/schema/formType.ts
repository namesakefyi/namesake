import { OlistIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { externalLink, internalLink } from "./annotations";

export const formType = defineType({
  name: "form",
  title: "Form",
  type: "document",
  icon: OlistIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Title of the form (e.g. 'Court Order: Massachusetts')",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description:
        "A brief, high-level summary of what role this form serves within the name change process.",
      type: "string",
    }),
    defineField({
      name: "banner",
      title: "Banner",
      description: "A banner message to display on the form title step.",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              defineArrayMember(externalLink),
              defineArrayMember(internalLink),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "The URL path for this form (e.g., 'social-security' for /forms/social-security). Must match an existing form page.",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "state",
      title: "State",
      type: "reference",
      to: [{ type: "state" }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: subtitle ? `/${subtitle}` : "No slug",
      };
    },
  },
});
