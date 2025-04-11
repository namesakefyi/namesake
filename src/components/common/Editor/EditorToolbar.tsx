import type { Editor } from "@tiptap/react";
import {
  BoldIcon,
  Heading,
  Heading2,
  ItalicIcon,
  Link,
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
import { useCallback, useEffect } from "react";
import {
  Separator,
  ToggleButton,
  type ToggleButtonProps,
  Toolbar,
  Tooltip,
  TooltipTrigger,
} from "..";
import type { ExtensionGroup } from "./extensions/constants";

type EditorToggleButtonProps = {
  icon: LucideIcon;
  label: string;
} & Omit<ToggleButtonProps, "icon" | "size">;

const EditorToggleButton = ({
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

type EditorToolbarProps = {
  editor: Editor;
  extensions?: ExtensionGroup[];
};

export const EditorToolbar = ({ editor, extensions }: EditorToolbarProps) => {
  if (!editor) return null;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    // TODO: Use custom dialog

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (error) {
      console.error(error);
    }
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setLink();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setLink]);

  return (
    <Toolbar
      orientation="horizontal"
      className="p-3 shadow-[0_1px_0_0_var(--color-gray-a5)] sticky bg-element rounded-t-lg top-0 z-10"
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

      {extensions?.includes("headings") && (
        <>
          <Separator orientation="vertical" />
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
        </>
      )}
      {extensions?.includes("basic") && (
        <>
          <Separator orientation="vertical" />
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
          <EditorToggleButton
            icon={Link}
            label="Link"
            onPress={setLink}
            isDisabled={
              !editor.can().chain().focus().setLink({ href: "" }).run()
            }
            isSelected={editor.isActive("link")}
          />
          <EditorToggleButton
            icon={Unlink}
            label="Unlink"
            onPress={() => editor.chain().focus().unsetLink().run()}
            isDisabled={!editor.can().chain().focus().unsetLink().run()}
            isSelected={false}
          />
        </>
      )}

      {extensions?.includes("lists") && (
        <>
          <Separator orientation="vertical" />
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
        </>
      )}

      {extensions?.includes("advanced") && (
        <>
          <Separator orientation="vertical" />
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
        </>
      )}
    </Toolbar>
  );
};
