import type { Extensions } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import ListKeymap from "@tiptap/extension-list-keymap";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import Typography from "@tiptap/extension-typography";
import { StepContent, StepItem, StepTitle, Steps } from "tiptap-steps";
import { Button } from "./button";

export const REQUIRED_EXTENSIONS = [
  Text,
  Paragraph,
  HardBreak,
  Typography,
  History,
  Gapcursor,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: ({ node }) => {
      if (node.type.name === "stepTitle") {
        return "Step title";
      }

      if (node.type.name === "stepContent") {
        return "Step instructions";
      }

      return "Write something…";
    },
  }),
];

export type ExtensionGroup = "headings" | "basic" | "lists" | "advanced";

export const EXTENSION_GROUPS: Record<ExtensionGroup, Extensions> = {
  headings: [
    Heading.configure({
      levels: [2, 3],
    }),
  ],
  basic: [
    Bold,
    Italic,
    Link.configure({
      openOnClick: false,
      defaultProtocol: "https",
    }),
    Blockquote,
  ],
  lists: [
    ListKeymap.configure({
      listTypes: [
        {
          itemName: "listItem",
          wrapperNames: ["bulletList", "orderedList"],
        },
        {
          itemName: "stepItem",
          wrapperNames: ["steps"],
        },
      ],
    }),
    BulletList,
    ListItem,
    OrderedList,
  ],
  advanced: [Steps, StepItem, StepTitle, StepContent, Button],
};
