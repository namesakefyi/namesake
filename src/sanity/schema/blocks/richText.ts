import type { TitledListValue } from "@sanity/types";
import type { RoughAnnotationType } from "rough-notation/lib/model";
import type { NamesakeColor } from "../../../constants/colors";
import { colors } from "../../../constants/colors";
import { externalLink, internalLink } from "../annotations";

export const richTextBlock = {
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H1", value: "h1" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
    { title: "H4", value: "h4" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Emphasis", value: "em" },
    ],
    annotations: [externalLink, internalLink],
  },
};

export const annotationOptions: TitledListValue<RoughAnnotationType>[] = [
  { title: "Highlight", value: "highlight" },
  { title: "Underline", value: "underline" },
  { title: "Strike-through", value: "strike-through" },
  { title: "Bracket", value: "bracket" },
  { title: "Circle", value: "circle" },
  { title: "Box", value: "box" },
  { title: "Crossed-off", value: "crossed-off" },
];

export const colorOptions: TitledListValue<NamesakeColor>[] = Object.entries(
  colors,
).map(([key, color]) => ({
  title: color.name,
  value: key as NamesakeColor,
}));
