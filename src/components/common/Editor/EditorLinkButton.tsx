import type { Editor } from "@tiptap/react";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Button,
  DialogTrigger,
  Form,
  Popover,
  TextField,
} from "@/components/common";
import { EditorToggleButton } from "./EditorToolbar";

type EditorLinkButtonProps = {
  editor: Editor;
};

export const EditorLinkButton = ({ editor }: EditorLinkButtonProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

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
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPopoverOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setUrl(editor.getAttributes("link").href);
  }, [isPopoverOpen]);

  return (
    <DialogTrigger isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <EditorToggleButton
        icon={Link}
        label="Link"
        onPress={() => setIsPopoverOpen(true)}
        isDisabled={!editor.can().chain().focus().setLink({ href: "" }).run()}
        isSelected={editor.isActive("link")}
      />
      <Popover className="p-2 w-80 max-w-full">
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-row items-start gap-1 w-full">
            <TextField
              aria-label="URL"
              autoFocus
              type="url"
              value={url ?? ""}
              onChange={setUrl}
              className="flex-1"
              prefix={<Link className="size-4 text-primary-9 ml-2 -mr-0.5" />}
              size="small"
            />
            <Button type="submit" variant="primary" size="small">
              Apply
            </Button>
          </div>
        </Form>
      </Popover>
    </DialogTrigger>
  );
};
