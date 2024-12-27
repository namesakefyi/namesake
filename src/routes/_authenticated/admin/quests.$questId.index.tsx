import { PageHeader } from "@/components/app";
import {
  Button,
  Form,
  Link,
  RichText,
  Select,
  SelectItem,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import {
  CATEGORIES,
  type Category,
  JURISDICTIONS,
  type Jurisdiction,
} from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { CircleHelp, Pencil, Trash } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/quests/$questId/")({
  component: AdminQuestDetailRoute,
});

const URLInput = memo(function URLInput({
  value,
  onChange,
  onRemove,
  hideLabel = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  hideLabel?: boolean;
}) {
  return (
    <div className="flex gap-2 items-end">
      <TextField
        value={value}
        onChange={onChange}
        label={hideLabel ? undefined : "URL"}
        aria-label={hideLabel ? "URL" : undefined}
        className="flex-1"
      />
      <Button type="button" variant="ghost" onPress={onRemove} icon={Trash} />
    </div>
  );
});

function AdminQuestDetailRoute() {
  const { questId } = Route.useParams();
  const quest = useQuery(api.quests.getById, {
    questId: questId as Id<"quests">,
  });
  const update = useMutation(api.quests.setAll);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (quest) {
      setTitle(quest.title ?? "");
      setCategory(quest.category as Category);
      setJurisdiction(quest.jurisdiction as Jurisdiction);
      setUrls(quest.urls ?? []);
      setContent(quest.content ?? "");
    }
  }, [quest]);

  if (quest === undefined) return null;
  if (quest === null) return <div>Form not found</div>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    update({
      questId: questId as Id<"quests">,
      title,
      category: category ?? undefined,
      jurisdiction: jurisdiction ?? undefined,
      urls: urls ?? undefined,
      content,
    }).then(() => {
      toast(`Updated quest: ${title}`);
    });
  };

  return (
    <>
      <PageHeader title={title}>
        <Link
          href={{ to: "/admin/quests/$questId/form", params: { questId } }}
          button={{ variant: "secondary" }}
        >
          <Pencil size={16} />
          Edit form
        </Link>
      </PageHeader>
      <Form className="w-full items-start" onSubmit={handleSubmit}>
        <Select
          label="Category"
          name="category"
          selectedKey={category}
          onSelectionChange={(value) => setCategory(value as Category)}
          placeholder="Select a category"
          isRequired
        >
          {Object.entries(CATEGORIES).map(([key, { label, icon }]) => {
            const Icon = icon ?? CircleHelp;
            return (
              <SelectItem key={key} id={key} textValue={key}>
                <Icon size={20} /> {label}
              </SelectItem>
            );
          })}
        </Select>
        <TextField
          label="Title"
          name="title"
          isRequired
          value={title}
          onChange={(value) => setTitle(value)}
        />
        <Select
          label="Jurisdiction"
          name="jurisdiction"
          selectedKey={jurisdiction}
          onSelectionChange={(key) => setJurisdiction(key as Jurisdiction)}
          placeholder="Select a jurisdiction"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <div className="flex flex-col gap-2">
          {urls.map((url, index) => (
            <URLInput
              // biome-ignore lint/suspicious/noArrayIndexKey:
              key={index}
              value={url}
              onChange={(value) => {
                const newUrls = [...urls];
                newUrls[index] = value;
                setUrls(newUrls);
              }}
              onRemove={() => {
                setUrls(urls.filter((_, i) => i !== index));
              }}
              hideLabel={index > 0}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            onPress={() => setUrls([...urls, ""])}
          >
            Add URL
          </Button>
        </div>
        <RichText initialContent={content} onChange={setContent} />
        <div className="flex gap-2 justify-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </Form>
    </>
  );
}
