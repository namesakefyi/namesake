import type { Editor } from "@tiptap/react";
import {
  BoldIcon,
  Heading,
  Heading2,
  ItalicIcon,
  List,
  ListOrdered,
  type LucideIcon,
  Milestone,
  MousePointerClick,
  Redo,
  TextQuote,
  Undo,
  Unlink,
} from "lucide-react";
import {
  Separator,
  ToggleButton,
  type ToggleButtonProps,
  Toolbar,
  Tooltip,
  TooltipTrigger,
} from "..";
import { EditorLinkButton } from "./EditorLinkButton";
import type { ExtensionGroup } from "./extensions/constants";

type EditorToggleButtonProps = {
  icon: LucideIcon;
  label: string;
} & Omit<ToggleButtonProps, "icon" | "size">;

export const EditorToggleButton = ({
  icon,
  label,
  onPress,
  ...props
}: EditorToggleButtonProps) => {
  return (
    <TooltipTrigger>
      <ToggleButton
        aria-label={label}
        onPress={onPress}
        icon={icon}
        size="small"
        {...props}
      />
      <Tooltip placement="top">{label}</Tooltip>
    </TooltipTrigger>
  );
};

type EditorToolbarSectionProps = {
  children: React.ReactNode;
  isVisible?: boolean;
};

const EditorToolbarSection = ({
  children,
  isVisible = true,
}: EditorToolbarSectionProps) => {
  return isVisible ? (
    <>
      <Separator orientation="vertical" />
      {children}
    </>
  ) : null;
};

type EditorToolbarProps = {
  editor: Editor;
  extensions?: ExtensionGroup[];
};

export const EditorToolbar = ({ editor, extensions }: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <Toolbar
      orientation="horizontal"
      className="px-3 py-2 shadow-[0_1px_0_0_var(--color-gray-a5)] sticky bg-element rounded-t-lg top-0 z-10"
    >
      <EditorToggleButton
        icon={Undo}
        label="Undo"
        onPress={() => editor.chain().focus().undo().run()}
        isDisabled={!editor.can().chain().focus().undo().run()}
        isSelected={false}
      />
      <EditorToggleButton
        icon={Redo}
        label="Redo"
        onPress={() => editor.chain().focus().redo().run()}
        isDisabled={!editor.can().chain().focus().redo().run()}
        isSelected={false}
      />
      <EditorToolbarSection isVisible={extensions?.includes("headings")}>
        <EditorToggleButton
          icon={Heading}
          label="Heading"
          onPress={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isDisabled={
            !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
          }
          isSelected={editor.isActive("heading", { level: 2 })}
        />
        <EditorToggleButton
          icon={Heading2}
          label="Subheading"
          onPress={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isDisabled={
            !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
          }
          isSelected={editor.isActive("heading", { level: 3 })}
        />
      </EditorToolbarSection>
      <EditorToolbarSection isVisible={extensions?.includes("basic")}>
        <EditorToggleButton
          icon={BoldIcon}
          label="Bold"
          onPress={() => editor.chain().focus().toggleBold().run()}
          isDisabled={!editor.can().chain().focus().toggleBold().run()}
          isSelected={editor.isActive("bold")}
        />
        <EditorToggleButton
          icon={ItalicIcon}
          label="Italic"
          onPress={() => editor.chain().focus().toggleItalic().run()}
          isDisabled={!editor.can().chain().focus().toggleItalic().run()}
          isSelected={editor.isActive("italic")}
        />
        <EditorToggleButton
          icon={TextQuote}
          label="Quote"
          onPress={() => editor.chain().focus().toggleBlockquote().run()}
          isDisabled={!editor.can().chain().focus().toggleBlockquote().run()}
          isSelected={editor.isActive("blockquote")}
        />
        <EditorLinkButton editor={editor} />
        <EditorToggleButton
          icon={Unlink}
          label="Unlink"
          onPress={() => editor.chain().focus().unsetLink().run()}
          isDisabled={!editor.can().chain().focus().unsetLink().run()}
          isSelected={false}
        />
      </EditorToolbarSection>
      <EditorToolbarSection isVisible={extensions?.includes("lists")}>
        <EditorToggleButton
          icon={ListOrdered}
          label="Numbered list"
          onPress={() => editor.chain().focus().toggleOrderedList().run()}
          isDisabled={!editor.can().chain().focus().toggleOrderedList().run()}
          isSelected={editor.isActive("orderedList")}
        />
        <EditorToggleButton
          icon={List}
          label="Unordered list"
          onPress={() => editor.chain().focus().toggleBulletList().run()}
          isDisabled={!editor.can().chain().focus().toggleBulletList().run()}
          isSelected={editor.isActive("bulletList")}
        />
      </EditorToolbarSection>
      <EditorToolbarSection isVisible={extensions?.includes("advanced")}>
        <EditorToggleButton
          icon={Milestone}
          label="Steps"
          onPress={() => editor.chain().focus().toggleSteps().run()}
          isDisabled={!editor.can().chain().focus().toggleSteps().run()}
          isSelected={editor.isActive("steps")}
        />
        <EditorToggleButton
          icon={MousePointerClick}
          label="Button"
          onPress={() => editor.chain().focus().toggleButton().run()}
          isDisabled={!editor.can().chain().focus().toggleButton().run()}
          isSelected={editor.isActive("button")}
        />
      </EditorToolbarSection>
    </Toolbar>
  );
};
