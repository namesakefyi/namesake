import type { Editor } from "@tiptap/react";
import {
  BoldIcon,
  ItalicIcon,
  List,
  ListOrdered,
  Milestone,
} from "lucide-react";
import { Separator, ToggleButton } from "..";

export const EditorToolbar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  return (
    <div className="flex items-center w-full border-b border-gray-dim pb-2 mb-4">
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
      <Separator orientation="vertical" />
      <ToggleButton
        onPress={() => editor.chain().focus().toggleSteps().run()}
        isDisabled={!editor.can().chain().focus().toggleSteps().run()}
        isSelected={editor.isActive("steps")}
        icon={Milestone}
        aria-label="Toggle steps"
        size="small"
      />
    </div>
  );
};
