import type { Editor } from "@tiptap/react";
import {
  BoldIcon,
  ItalicIcon,
  List,
  ListOrdered,
  type LucideIcon,
  Milestone,
  MousePointerClick,
} from "lucide-react";
import {
  Separator,
  ToggleButton,
  type ToggleButtonProps,
  Toolbar,
  Tooltip,
  TooltipTrigger,
} from "..";

type EditorToggleButtonProps = {
  editor: Editor;
  icon: LucideIcon;
  label: string;
} & ToggleButtonProps;

const EditorToggleButton = ({
  editor,
  icon,
  label,
  onPress,
  ...props
}: EditorToggleButtonProps) => {
  return (
    <TooltipTrigger>
      <ToggleButton onPress={onPress} icon={icon} size="small" {...props} />
      <Tooltip>{label}</Tooltip>
    </TooltipTrigger>
  );
};

export const EditorToolbar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  return (
    <Toolbar
      orientation="horizontal"
      className="p-3 border-b border-gray-dim sticky bg-gray-3 rounded-t-lg top-0 z-10"
    >
      <EditorToggleButton
        editor={editor}
        icon={BoldIcon}
        label="Bold"
        onPress={() => editor.chain().focus().toggleBold().run()}
        isDisabled={!editor.can().chain().focus().toggleBold().run()}
        isSelected={editor.isActive("bold")}
      />
      <EditorToggleButton
        editor={editor}
        icon={ItalicIcon}
        label="Italic"
        onPress={() => editor.chain().focus().toggleItalic().run()}
        isDisabled={!editor.can().chain().focus().toggleItalic().run()}
        isSelected={editor.isActive("italic")}
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
      <ToggleButton
        onPress={() => editor.chain().focus().toggleButton().run()}
        isDisabled={!editor.can().chain().focus().toggleButton().run()}
        isSelected={editor.isActive("button")}
        icon={MousePointerClick}
        aria-label="Toggle button"
        size="small"
      />
    </Toolbar>
  );
};
