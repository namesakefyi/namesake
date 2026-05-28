import { OlistIcon } from "@sanity/icons";
import type { ObjectDefinition } from "sanity";

export const formEmbedBlock: ObjectDefinition = {
  type: "object",
  name: "formEmbed",
  title: "Form",
  icon: OlistIcon,
  fields: [
    {
      name: "form",
      title: "Form",
      type: "reference",
      to: [{ type: "form" }],
    },
  ],
  preview: {
    select: {
      title: "form.title",
      subtitle: "form.slug.current",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title ?? "No form selected",
        subtitle: subtitle ? `/forms/${subtitle}` : undefined,
      };
    },
  },
};
