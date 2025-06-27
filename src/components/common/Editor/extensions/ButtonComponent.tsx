import { useRouter } from "@tanstack/react-router";
import {
  NodeViewContent,
  type NodeViewProps,
  NodeViewWrapper,
} from "@tiptap/react";
import { LinkIcon, Unlink } from "lucide-react";
import { useRef, useState } from "react";
import { useInteractOutside } from "react-aria";
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

type LinkType = "internal" | "external";

export default function ButtonComponent({ editor, node }: NodeViewProps) {
  const { routesByPath } = useRouter();
  const [url, setUrl] = useState<string | null>(
    node.attrs.href &&
      node.attrs.href.length > 0 &&
      !node.attrs.href.startsWith("/forms/")
      ? node.attrs.href
      : "https://",
  );
  const [form, setForm] = useState<string | null>(
    node.attrs.href?.startsWith("/forms/") ? node.attrs.href : null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<LinkType>(
    node.attrs.href?.startsWith("/forms/") ? "internal" : "external",
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useInteractOutside({
    ref: containerRef,
    onInteractOutside: () => setIsOpen(false),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const href = selectedTab === "internal" ? form : url;
    editor.chain().focus().updateAttributes("button", { href }).run();
    setIsOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const formRoutes = Object.entries(routesByPath ?? {})
    .filter(([path]) => path.startsWith("/forms/"))
    .map(([path]) => ({
      value: path,
      label: path,
    }));

  const tooltipText = () => {
    if (
      selectedTab === "external" &&
      url &&
      url.length > 0 &&
      url !== "https://"
    ) {
      return url;
    }
    if (selectedTab === "internal" && form) {
      return form;
    }
    return "Click to add link";
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
                <span className="text-primary-9">Insert button text</span>
              )}
              <NodeViewContent />
              {!node.attrs.href && <Badge icon={Unlink}>No link</Badge>}
            </Button>
            <Tooltip>{tooltipText()}</Tooltip>
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
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as LinkType)}
                className="gap-2"
                size="small"
              >
                <TabList>
                  <Tab id="internal">Internal</Tab>
                  <Tab id="external">External</Tab>
                </TabList>
                <TabPanel
                  id="internal"
                  className="flex flex-row items-start gap-1 w-full"
                >
                  <Select
                    aria-label="Select path"
                    selectedKey={form}
                    onSelectionChange={(value) => {
                      setForm(value?.toString() ?? null);
                    }}
                    placeholder="Select path"
                    className="flex-1"
                    items={formRoutes}
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
                </TabPanel>
                <TabPanel
                  id="external"
                  className="flex flex-row items-start gap-1 w-full"
                >
                  <TextField
                    aria-label="URL"
                    type="url"
                    value={url ?? ""}
                    onChange={setUrl}
                    className="flex-1"
                    prefix={
                      <LinkIcon className="size-4 text-primary-9 ml-2 -mr-0.5" />
                    }
                  />
                  <Button type="submit" variant="primary">
                    Apply
                  </Button>
                </TabPanel>
              </Tabs>
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
