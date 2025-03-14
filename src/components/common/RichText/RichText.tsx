import { FieldGroup, Separator, ToggleButton } from "@/components/common";
import { ReadingScore } from "@/components/quests";
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
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export interface RichTextProps {
  className?: string;
  showReadingScore?: boolean;
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export function RichText({
  className,
  showReadingScore = false,
  initialContent,
  onChange,
  editable = true,
  placeholder = "Write something...",
}: RichTextProps) {
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
        placeholder,
      }),

      // Basic formatting
      Bold,
      Italic,
      Link.configure({
        openOnClick: false,
        defaultProtocol: "https",
      }),

      Blockquote,
      BulletList,
      ListItem,
      ListKeymap,
      OrderedList,
    ],
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
        true: "px-3.5 py-3 [&_.tiptap]:outline-hidden",
        false:
          "ring-0 rounded-none bg-transparent focus-within:outline-hidden!",
      },
    },
  });

  return (
    <FieldGroup className={styles({ editable })}>
      <EditorContent
        editor={editor}
        className={twMerge("w-full prose", className)}
      />
      <BubbleMenu
        editor={editor}
        className="bg-gray-1 dark:bg-graydark-2 border border-gray-dim p-1.5 gap-px rounded-xl shadow-md flex items-center data-[state=visible]:opacity-100 data-[state=hidden]:opacity-0 transition-opacity *:border-none"
      >
        <ToggleButton
          onPress={() => editor.chain().focus().toggleBold().run()}
          isDisabled={!editor.can().chain().focus().toggleBold().run()}
          isSelected={editor.isActive("bold")}
          icon={BoldIcon}
          aria-label="Toggle bold text"
          size="small"
        />
        <ToggleButton
          onPress={() => editor.chain().focus().toggleItalic().run()}
          isDisabled={!editor.can().chain().focus().toggleItalic().run()}
          isSelected={editor.isActive("italic")}
          icon={ItalicIcon}
          aria-label="Toggle italic text"
          size="small"
        />
        <Separator orientation="vertical" />
        <ToggleButton
          onPress={() => editor.chain().focus().toggleBulletList().run()}
          isDisabled={!editor.can().chain().focus().toggleBulletList().run()}
          isSelected={editor.isActive("bulletList")}
          icon={List}
          aria-label="Toggle bulleted list"
          size="small"
        />
        <ToggleButton
          onPress={() => editor.chain().focus().toggleOrderedList().run()}
          isDisabled={!editor.can().chain().focus().toggleOrderedList().run()}
          isSelected={editor.isActive("orderedList")}
          icon={ListOrdered}
          aria-label="Toggle numbered list"
          size="small"
        />
      </BubbleMenu>
      {showReadingScore && (
        <div className="border-t border-gray-dim">
          <ReadingScore text={editor.state.doc.textContent} />
        </div>
      )}
    </FieldGroup>
  );
}
