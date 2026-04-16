import { HelpCircleIcon } from "@sanity/icons";
import { defineArrayMember, type ObjectDefinition } from "sanity";
import { externalLink } from "../annotations/externalLink";
import { internalLink } from "../annotations/internalLink";

export const detailsBlock: ObjectDefinition = {
  type: "object",
  name: "details",
  title: "Details",
  icon: HelpCircleIcon,
  fields: [
    {
      name: "summary",
      type: "string",
    },
    {
      name: "content",
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
    },
  ],
  preview: {
    select: {
      title: "summary",
      subtitle: "content",
    },
  },
};
