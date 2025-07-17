import { DisclosuresKit, StepsKit } from "@namesake/tiptap-extensions";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { Document } from "@tiptap/extension-document";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Heading } from "@tiptap/extension-heading";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import {
  BulletList,
  ListItem,
  ListKeymap,
  OrderedList,
} from "@tiptap/extension-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Typography } from "@tiptap/extension-typography";
import { Gapcursor, Placeholder, UndoRedo } from "@tiptap/extensions";
import {
  EditorContent,
  type EditorContentProps,
  type EditorEvents,
  useEditor,
} from "@tiptap/react";
import { useEffect } from "react";
import { tv } from "tailwind-variants";
import { FieldGroup } from "@/components/common";
import { EditorToolbar } from "./EditorToolbar";
import { Button } from "./extensions/button";

export interface EditorProps
  extends Omit<EditorContentProps, "onChange" | "editor" | "placeholder"> {
  /**
   * Custom styles to apply to the editor.
   */
  className?: string;

  /**
   * The initial content of the editor.
   */
  initialContent?: string;

  /**
   * Callback function that is called when the editor content is updated.
   * @param props - The event object.
   * @example
   * ```tsx
   * <Editor
   *   onUpdate={(props) => {
   *     setContent(props.editor.getHTML());
   *   }}
   * />
   * ```
   */
  onUpdate?: (props: EditorEvents["update"]) => void;

  /**
   * Whether the editor should be editable.
   * @default true
   */
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
      Document.extend({
        content: "(block | steps)+",
      }),
      Text,
      Paragraph,
      HardBreak,
      Typography,
      UndoRedo,
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
      Heading.configure({
        levels: [2, 3],
      }),
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
      StepsKit,
      DisclosuresKit,
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
    base: "w-full flex-col outline-none bg-transparent!",
    variants: {
      editable: {
        true: "[&_.tiptap]:outline-none",
        false: "border-none rounded-none focus-within:outline-none!",
      },
    },
  });

  const contentStyles = tv({
    base: "w-full prose whitespace-pre-wrap",
    variants: {
      editable: {
        true: "p-5",
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
