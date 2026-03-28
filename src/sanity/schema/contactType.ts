import { UsersIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { SERVICES } from "../../constants/services";

export const contactType = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  icon: UsersIcon,
  fieldsets: [{ name: "contactInfo", title: "Contact Info" }],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "Name of the organization or individual.",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "In their words...",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: "states",
      title: "States",
      description: "The states this organization serves.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "state" }] })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "name",
        maxLength: 96,
      },
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: SERVICES,
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      description: "Should be dark on a transparent or white background.",
      type: "image",
    }),
    defineField({
      name: "officialPartner",
      title: "Official Namesake Partner",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      fieldset: "contactInfo",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      placeholder: "xxx-xxx-xxxx",
      type: "string",
      fieldset: "contactInfo",
      validation: (Rule) =>
        Rule.regex(/^\d{3}-\d{3}-\d{4}$/, {
          name: "phone number",
          invert: false,
        }).error("Must be in xxx-xxx-xxxx format"),
    }),
  ],
  preview: {
    select: {
      title: "name",
      state0: "states.0.name",
      media: "logo",
    },
    prepare({ title, state0, media }) {
      return {
        title,
        subtitle: state0,
        media,
      };
    },
  },
});
