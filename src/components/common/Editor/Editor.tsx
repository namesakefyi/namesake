import { FieldGroup } from "@/components/common";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
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
import {
  EditorContent,
  type EditorContentProps,
  type EditorEvents,
  useEditor,
} from "@tiptap/react";
import { useEffect } from "react";
import { tv } from "tailwind-variants";
import { EditorToolbar } from "./EditorToolbar";
import { Button, StepContent, StepItem, StepTitle, Steps } from "./extensions";

export interface EditorProps
  extends Omit<EditorContentProps, "onChange" | "editor"> {
  className?: string;
  initialContent?: string;
  onUpdate?: (props: EditorEvents["update"]) => void;
  editable?: boolean;
}

export function Editor({
  className,
  initialContent,
  onUpdate,
  editable = true,
  ...props
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      // Required
      Document,
      Text,
      Paragraph,
      HardBreak,
      Typography,
      History,
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

      // Basic formatting
      Bold,
      Italic,
      Link.configure({
        openOnClick: false,
        defaultProtocol: "https",
      }),

      Blockquote,
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

      // Custom
      Steps,
      StepItem,
      StepTitle,
      StepContent,
      Button,
    ],
    content: initialContent,
    editable,
    onUpdate,
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent ?? "");
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  const wrapperStyles = tv({
    base: "w-full flex-col",
    variants: {
      editable: {
        true: "[&_.tiptap]:outline-hidden",
        false:
          "border-none rounded-none bg-transparent focus-within:outline-hidden!",
      },
    },
  });

  const contentStyles = tv({
    base: "w-full prose",
    variants: {
      editable: {
        true: "p-4",
      },
    },
  });

  return (
    <FieldGroup className={wrapperStyles({ editable })}>
      {editable && <EditorToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className={contentStyles({ className, editable })}
        {...props}
      />
    </FieldGroup>
  );
}
