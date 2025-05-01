import {
  Badge,
  Button,
  Form,
  Link,
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
import { LinkIcon, Unlink } from "lucide-react";
import { useRef, useState } from "react";
import { useInteractOutside } from "react-aria";

export default function ButtonComponent({ editor, node }: NodeViewProps) {
  const [url, setUrl] = useState<string | null>(
    node.attrs.href && node.attrs.href.length > 0
      ? node.attrs.href
      : "https://",
  );
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useInteractOutside({
    ref: containerRef,
    onInteractOutside: () => setIsOpen(false),
  });

  const handleSave = () => {
    editor.chain().focus().updateAttributes("button", { href: url }).run();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
    setIsOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <NodeViewWrapper className="not-prose">
      {editor.isEditable ? (
        <div ref={containerRef}>
          <TooltipTrigger isDisabled={isOpen}>
            <Button
              variant="secondary"
              size="large"
              ref={triggerRef}
              className="cursor-text w-full"
              onPress={() => setIsOpen(true)}
            >
              {!node.textContent && (
                <span className="text-gray-9">Insert button text</span>
              )}
              <NodeViewContent />
              {!node.attrs.href && (
                <Badge icon={Unlink} variant="warning">
                  No URL
                </Badge>
              )}
            </Button>
            <Tooltip>
              {url && url.length > 0 && url !== "https://"
                ? url
                : "Click to add URL"}
            </Tooltip>
          </TooltipTrigger>
          <Popover
            ref={popoverRef}
            triggerRef={triggerRef}
            className="p-2 w-80 max-w-full"
            isNonModal
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            shouldCloseOnInteractOutside={() => false} // Manually handling
            UNSTABLE_portalContainer={containerRef.current ?? undefined}
          >
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-row items-start gap-1 w-full">
                <TextField
                  aria-label="URL"
                  type="url"
                  value={url ?? ""}
                  onChange={setUrl}
                  className="flex-1"
                  prefix={
                    <LinkIcon className="size-4 text-gray-9 ml-2 -mr-0.5" />
                  }
                  size="small"
                />
                <Button type="submit" variant="primary" size="small">
                  Apply
                </Button>
              </div>
            </Form>
          </Popover>
        </div>
      ) : (
        <Link
          button={{ variant: "secondary", size: "large" }}
          href={node.attrs.href}
          data-type="button"
        >
          <NodeViewContent />
        </Link>
      )}
    </NodeViewWrapper>
  );
}
