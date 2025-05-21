import {
  Badge,
  Button,
  Form,
  Link,
  Popover,
  Select,
  SelectItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { useRouter } from "@tanstack/react-router";
import {
  NodeViewContent,
  type NodeViewProps,
  NodeViewWrapper,
} from "@tiptap/react";
import { LinkIcon, Unlink } from "lucide-react";
import { type Key, useRef, useState } from "react";
import { useInteractOutside } from "react-aria";

export default function ButtonComponent({ editor, node }: NodeViewProps) {
  const { routesByPath } = useRouter();
  const [url, setUrl] = useState<string | null>(
    node.attrs.href && node.attrs.href.length > 0
      ? node.attrs.href
      : "https://",
  );
  const [form, setForm] = useState<string | null>(
    node.attrs.href?.startsWith("/forms/") ? node.attrs.href : null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"namesake" | "external">(
    node.attrs.href?.startsWith("/forms/") ? "namesake" : "external",
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useInteractOutside({
    ref: containerRef,
    onInteractOutside: () => setIsOpen(false),
  });

  const handleSave = () => {
    if (form) {
      editor.chain().focus().updateAttributes("button", { href: form }).run();
    } else if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
    setIsOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const handleFormSelect = (value: Key) => {
    setForm(value.toString());
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
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) =>
                setSelectedTab(key as "namesake" | "external")
              }
              className="gap-2"
            >
              <TabList>
                <Tab id="namesake">Namesake</Tab>
                <Tab id="external">External</Tab>
              </TabList>
              <TabPanel id="namesake">
                <Form
                  onSubmit={handleSubmit}
                  className="flex flex-row items-start gap-1 w-full"
                >
                  <Select
                    aria-label="Select path"
                    selectedKey={form}
                    onSelectionChange={handleFormSelect}
                    placeholder="Select path"
                    className="flex-1"
                    items={Object.entries(routesByPath)
                      .filter(([path]) => path.startsWith("/forms/"))
                      .map(([path]) => ({
                        value: path,
                        label: path,
                      }))}
                  >
                    {(item) => (
                      <SelectItem key={item.value} id={item.value}>
                        {item.label}
                      </SelectItem>
                    )}
                  </Select>
                  <Button type="submit" variant="primary">
                    Apply
                  </Button>
                </Form>
              </TabPanel>
              <TabPanel id="external">
                <Form
                  onSubmit={handleSubmit}
                  className="flex flex-row items-start gap-1 w-full"
                >
                  <TextField
                    aria-label="URL"
                    type="url"
                    value={url ?? ""}
                    onChange={setUrl}
                    className="flex-1"
                    prefix={
                      <LinkIcon className="size-4 text-gray-9 ml-2 -mr-0.5" />
                    }
                  />
                  <Button type="submit" variant="primary">
                    Apply
                  </Button>
                </Form>
              </TabPanel>
            </Tabs>
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
