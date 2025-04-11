import { FieldGroup } from "@/components/common";

import {
  EditorContent,
  type EditorContentProps,
  type EditorEvents,
  useEditor,
} from "@tiptap/react";
import { useEffect } from "react";
import { tv } from "tailwind-variants";
import { EditorToolbar } from "./EditorToolbar";
import {
  EXTENSION_GROUPS,
  type ExtensionGroup,
  REQUIRED_EXTENSIONS,
} from "./extensions";

export interface EditorProps
  extends Omit<EditorContentProps, "onChange" | "editor" | "placeholder"> {
  className?: string;
  initialContent?: string;
  onUpdate?: (props: EditorEvents["update"]) => void;
  editable?: boolean;
  /**
   * Which formatting extensions are available to the editor?
   * @default ["headings", "basic", "lists", "advanced"]
   */
  extensions?: ExtensionGroup[];
}

export function Editor({
  className,
  initialContent,
  onUpdate,
  editable = true,
  extensions = ["headings", "basic", "lists", "advanced"],
  ...props
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      ...REQUIRED_EXTENSIONS,
      ...extensions.flatMap((group) => EXTENSION_GROUPS[group]),
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
        true: "p-5",
      },
    },
  });

  return (
    <FieldGroup className={wrapperStyles({ editable })}>
      {editable && <EditorToolbar editor={editor} extensions={extensions} />}
      <EditorContent
        editor={editor}
        className={contentStyles({ className, editable })}
        {...props}
      />
    </FieldGroup>
  );
}
