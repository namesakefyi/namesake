import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic } from "lucide-react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { ReadingScore } from "../ReadingScore";
import { ToggleButton } from "../ToggleButton";

export interface RichTextProps {
  className?: string;
  showReadingScore?: boolean;
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export function RichText({
  className,
  showReadingScore = false,
  initialContent,
  onChange,
  editable = true,
}: RichTextProps) {
  const extensions = [StarterKit];

  const editor = useEditor({
    extensions,
    content: initialContent,
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent ?? "");
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  const styles = tv({
    base: "w-full",
    variants: {
      editable: {
        true: "border border-gray-dim flex flex-col rounded-xl [&_.tiptap]:p-4 [&_.tiptap]:outline-none",
      },
    },
  });

  return (
    <div className={styles({ editable })}>
      <EditorContent
        editor={editor}
        className={twMerge("w-full prose dark:prose-invert", className)}
      />
      {editable && (
        <>
          <BubbleMenu
            editor={editor}
            className="bg-gray-1 dark:bg-graydark-2 p-1.5 rounded-xl shadow-md flex gap-1 items-center"
          >
            <ToggleButton
              onPress={() => editor.chain().focus().toggleBold().run()}
              isDisabled={!editor.can().chain().focus().toggleBold().run()}
              isSelected={editor.isActive("bold")}
              icon={Bold}
              aria-label="Toggle bold text"
              size="small"
            />
            <ToggleButton
              onPress={() => editor.chain().focus().toggleItalic().run()}
              isDisabled={!editor.can().chain().focus().toggleItalic().run()}
              isSelected={editor.isActive("italic")}
              icon={Italic}
              aria-label="Toggle italic text"
              size="small"
            />
          </BubbleMenu>
          {showReadingScore && (
            <div className="border-t border-gray-dim">
              <ReadingScore text={editor.state.doc.textContent} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
