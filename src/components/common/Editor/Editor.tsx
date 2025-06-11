import { FieldGroup } from "@/components/common";
import Document from "@tiptap/extension-document";
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
} from "./extensions/constants";

const DocumentWithSteps = Document.extend({
  content: "(block | steps)+",
});

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
      extensions.includes("advanced") ? DocumentWithSteps : Document,
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
    base: "w-full flex-col outline-none bg-transparent",
    variants: {
      editable: {
        true: "[&_.tiptap]:outline-none",
        false: "border-none rounded-none focus-within:outline-none!",
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
