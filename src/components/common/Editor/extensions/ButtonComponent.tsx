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
  const [url, setUrl] = useState<string>(node.attrs.href);
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
            <Tooltip>{url.length > 0 ? url : "Click to add URL"}</Tooltip>
          </TooltipTrigger>
          <Popover
            title="Edit link"
            className="p-2 w-96 max-w-full"
            placement="top"
          >
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-row items-start gap-1 w-full">
                <TextField
                  aria-label="URL"
                  autoFocus
                  type="url"
                  value={url}
                  onChange={setUrl}
                  className="flex-1"
                  prefix={
                    <LinkIcon className="size-4 text-gray-9 ml-2.5 -mr-1" />
                  }
                />
                <Button type="submit" variant="primary">
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
