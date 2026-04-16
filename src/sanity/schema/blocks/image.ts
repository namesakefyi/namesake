import { ImageIcon } from "@sanity/icons";
import { defineArrayMember } from "sanity";
import { externalLink } from "../annotations/externalLink";
import { internalLink } from "../annotations/internalLink";

export const imageBlock = {
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    {
      name: "alt",
      type: "string",
      title: "Alt Text",
    },
    {
      name: "width",
      title: "Width",
      description: "Image width, in pixels",
      type: "number",
    },
    {
      name: "caption",
      title: "Caption",
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
};
