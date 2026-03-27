import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineType } from "sanity";
import {
  annotationOptions,
  blockquoteBlock,
  breakBlock,
  imageBlock,
  richTextBlock,
  youtubeBlock,
} from "./blocks";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(70).max(160),
    },
    {
      name: "showDescription",
      title: "Show description in page header",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "annotation",
      title: "Annotation",
      type: "string",
      description: "Rough annotation type for highlighting the title",
      options: {
        list: annotationOptions,
      },
    },
    {
      name: "authors",
      title: "Authors",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "author" }],
        }),
      ],
    },
    {
      name: "image",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
      ],
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember(richTextBlock),
        defineArrayMember(blockquoteBlock),
        defineArrayMember(breakBlock),
        defineArrayMember(imageBlock),
        defineArrayMember(youtubeBlock),
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "authors.0.name",
      media: "image",
      date: "publishDate",
    },
    prepare(selection) {
      const { title, author, date } = selection;
      const formattedDate = date
        ? new Date(date).toLocaleDateString()
        : "No date";
      const authorName = author || "No author";

      return {
        title: title,
        subtitle: `${authorName} · ${formattedDate}`,
        media: selection.media,
      };
    },
  },
  orderings: [
    {
      title: "Publish Date, New",
      name: "publishDateDesc",
      by: [{ field: "publishDate", direction: "desc" }],
    },
    {
      title: "Publish Date, Old",
      name: "publishDateAsc",
      by: [{ field: "publishDate", direction: "asc" }],
    },
    {
      title: "Title, A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
