import type { Editor } from "@tiptap/react";
import {
  BoldIcon,
  Heading,
  Heading2,
  ItalicIcon,
  List,
  ListCollapse,
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
  composeRenderProps,
  ToggleButton,
  type ToggleButtonProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "@/components/utils";
import { Separator, Toolbar, Tooltip, TooltipTrigger } from "..";
import { EditorLinkButton } from "./EditorLinkButton";

const toggleStyles = tv({
  extend: focusRing,
  base: "h-8 min-w-8 transition rounded-md shrink-0 flex items-center justify-center gap-2",
  variants: {
    isSelected: {
      false: "bg-transparent text-dim hover:text-normal hover:bg-theme-a3",
      true: "bg-theme-1 dark:bg-theme-4 text-normal",
    },
    isDisabled: {
      false: "cursor-pointer",
      true: "opacity-40",
    },
  },
});

type EditorToggleButtonProps = {
  icon: LucideIcon;
  label: string;
} & Omit<ToggleButtonProps, "icon" | "size">;

export const EditorToggleButton = ({
  icon: Icon,
  label,
  onPress,
  ...props
}: EditorToggleButtonProps) => {
  return (
    <TooltipTrigger>
      <ToggleButton
        aria-label={label}
        onPress={onPress}
        {...props}
        className={composeRenderProps(
          props.className,
          (className, renderProps) =>
            toggleStyles({ ...renderProps, className }),
        )}
      >
        <Icon className="size-4 shrink-0" />
      </ToggleButton>
      <Tooltip placement="top">{label}</Tooltip>
    </TooltipTrigger>
  );
};

type EditorToolbarSectionProps = {
  children: React.ReactNode;
  isVisible?: boolean;
};

const EditorToolbarSection = ({ children }: EditorToolbarSectionProps) => (
  <>
    <Separator orientation="vertical" />
    {children}
  </>
);

type EditorToolbarProps = {
  editor: Editor;
};

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <Toolbar
      orientation="horizontal"
      className="px-3 py-2 shadow-[0_1px_0_0_var(--color-theme-a5)] sticky bg-element rounded-t-lg top-0 z-10"
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
      <EditorToolbarSection>
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
      <EditorToolbarSection>
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
      <EditorToolbarSection>
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
      <EditorToolbarSection>
        <EditorToggleButton
          icon={Milestone}
          label="Steps"
          onPress={() => editor.chain().focus().toggleSteps().run()}
          isDisabled={!editor.can().chain().focus().toggleSteps().run()}
          isSelected={editor.isActive("steps")}
        />
        <EditorToggleButton
          icon={ListCollapse}
          label="Disclosure"
          onPress={() => editor.chain().focus().toggleDisclosures().run()}
          isDisabled={!editor.can().chain().focus().toggleDisclosures().run()}
          isSelected={editor.isActive("disclosures")}
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
