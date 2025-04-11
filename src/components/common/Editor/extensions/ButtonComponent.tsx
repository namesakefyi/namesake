import {
  Button,
  DialogTrigger,
  Form,
  Link,
  type LinkProps,
  Popover,
  TextField,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import {
  NodeViewContent,
  type NodeViewProps,
  NodeViewWrapper,
} from "@tiptap/react";
import { LinkIcon } from "lucide-react";
import { useState } from "react";

export default function ButtonComponent({ editor, node }: NodeViewProps) {
  const [url, setUrl] = useState(node.attrs.href);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    editor.chain().focus().updateAttributes("button", { href: url }).run();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    handleSave();
  };

  const sharedLinkProps: Partial<LinkProps> & { "data-type": "button" } = {
    button: { variant: "secondary", size: "large" },
    href: node.attrs.href,
    "data-type": "button",
  };

  return (
    <NodeViewWrapper className="not-prose">
      {editor.isEditable ? (
        <DialogTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
          <TooltipTrigger>
            <Link onPress={() => setIsOpen(true)} {...sharedLinkProps}>
              <NodeViewContent />
            </Link>
            <Tooltip>
              {url} <span className="opacity-50 italic">click to edit</span>
            </Tooltip>
          </TooltipTrigger>
          <Popover title="Edit link" className="p-2" placement="top">
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-row items-center gap-2 w-full">
                <LinkIcon className="size-4 ml-1" />
                <TextField
                  autoFocus
                  aria-label="URL"
                  type="url"
                  value={url}
                  onChange={setUrl}
                  size="small"
                  className="flex-1"
                />
                <Button type="submit" size="small" variant="primary">
                  Save
                </Button>
              </div>
            </Form>
          </Popover>
        </DialogTrigger>
      ) : (
        <Link {...sharedLinkProps}>
          <NodeViewContent />
        </Link>
      )}
    </NodeViewWrapper>
  );
}
