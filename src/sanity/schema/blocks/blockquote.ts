import { BlockquoteIcon } from "@sanity/icons";
import { defineArrayMember, type ObjectDefinition } from "sanity";
import { externalLink } from "../annotations/externalLink";
import { internalLink } from "../annotations/internalLink";

export const blockquoteBlock: ObjectDefinition = {
  type: "object",
  name: "blockquote",
  title: "Blockquote",
  icon: BlockquoteIcon,
  fields: [
    {
      name: "content",
      title: "Quote",
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
    {
      name: "cite",
      type: "string",
    },
  ],
  preview: {
    select: {
      title: "content",
      subtitle: "cite",
    },
    prepare(selection: {
      title?: Array<{ children?: Array<{ text?: string }> }>;
      subtitle?: string;
    }) {
      const { title, subtitle } = selection;
      const content = title?.[0]?.children?.[0]?.text || "No content";
      return {
        title: content.length > 50 ? `${content.substring(0, 50)}...` : content,
        subtitle: subtitle ? `— ${subtitle}` : "No citation",
      };
    },
  },
};
