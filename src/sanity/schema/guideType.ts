import { NumberIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  blockquoteBlock,
  breakBlock,
  costsBlock,
  detailsBlock,
  formEmbedBlock,
  imageBlock,
  richTextBlock,
  youtubeBlock,
} from "./blocks";

export const guideType = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  icon: NumberIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Title of the guide (e.g. 'Court Order')",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description:
        "A brief, high-level summary of what role this guide serves within the name change process.",
      type: "string",
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
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "The URL path for this guide (e.g., 'court-order' for /court-order)",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "unlisted",
      title: "Unlisted",
      description:
        "Hide this guide from the guides index. The guide will still be accessible by URL.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "costs",
      title: "Costs",
      type: "array",
      of: [
        {
          title: "Cost",
          name: "cost",
          type: "object",
          options: {
            columns: 3,
            modal: {
              type: "popover",
            },
          },
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },
            {
              name: "amount",
              title: "Amount",
              type: "number",
            },
            {
              name: "required",
              title: "Required?",
              type: "string",
              initialValue: "required",
              options: {
                list: [
                  { title: "Required", value: "required" },
                  { title: "Not required", value: "notRequired" },
                ],
              },
            },
          ],
          preview: {
            select: {
              title: "title",
              amount: "amount",
            },
            prepare(selection) {
              const { title, amount } = selection;
              return {
                title: title,
                subtitle: amount ? `$${amount}` : "Free",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember(blockquoteBlock),
        defineArrayMember(breakBlock),
        defineArrayMember(costsBlock),
        defineArrayMember(detailsBlock),
        defineArrayMember(formEmbedBlock),
        defineArrayMember(richTextBlock),
        defineArrayMember(imageBlock),
        defineArrayMember(youtubeBlock),
      ],
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
