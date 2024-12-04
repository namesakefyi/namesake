import { ReadingScore } from "@/components/quests/ReadingScore";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
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
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import {
  Bold as BoldIcon,
  Heading2,
  Heading3,
  Italic as ItalicIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { Separator } from "../Separator";
import { ToggleButton } from "../ToggleButton";

type FeatureSet = "basic" | "full";

export interface RichTextProps {
  className?: string;
  showReadingScore?: boolean;
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  features?: FeatureSet;
}

export function RichText({
  className,
  showReadingScore = false,
  initialContent,
  onChange,
  editable = true,
  features = "basic",
}: RichTextProps) {
  const requiredExtensions = [
    Document,
    Text,
    Paragraph,
    HardBreak,
    Typography,
    History,
    Placeholder.configure({
      placeholder: "Write something...",
    }),
  ];

  const basicExtensions = [
    ...requiredExtensions,
    Bold,
    Italic,
    Link.configure({
      openOnClick: false,
      defaultProtocol: "https",
    }),
  ];

  const fullExtensions = [
    ...basicExtensions,
    Heading.configure({
      levels: [2, 3],
    }),
    Blockquote,
    BulletList,
    ListItem,
    ListKeymap,
    OrderedList,
  ];

  const editor = useEditor({
    extensions: features === "basic" ? basicExtensions : fullExtensions,
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
        true: "[&_.tiptap]:outline-none",
      },
    },
  });

  return (
    <div className={styles({ editable })}>
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
        {features === "full" && (
          <>
            <Separator orientation="vertical" />
            <ToggleButton
              onPress={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isDisabled={
                !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
              }
              isSelected={editor.isActive("heading", { level: 2 })}
              icon={Heading2}
              aria-label="Toggle second-level heading text"
              size="small"
            />
            <ToggleButton
              onPress={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isDisabled={
                !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
              }
              isSelected={editor.isActive("heading", { level: 3 })}
              icon={Heading3}
              aria-label="Toggle third-level heading text"
              size="small"
            />
            <Separator orientation="vertical" />
            <ToggleButton
              onPress={() => editor.chain().focus().toggleBulletList().run()}
              isDisabled={
                !editor.can().chain().focus().toggleBulletList().run()
              }
              isSelected={editor.isActive("bulletList")}
              icon={List}
              aria-label="Toggle bulleted list"
              size="small"
            />
            <ToggleButton
              onPress={() => editor.chain().focus().toggleOrderedList().run()}
              isDisabled={
                !editor.can().chain().focus().toggleOrderedList().run()
              }
              isSelected={editor.isActive("orderedList")}
              icon={ListOrdered}
              aria-label="Toggle numbered list"
              size="small"
            />
          </>
        )}
      </BubbleMenu>
      {showReadingScore && (
        <div className="border-t border-gray-dim">
          <ReadingScore text={editor.state.doc.textContent} />
        </div>
      )}
    </div>
  );
}
