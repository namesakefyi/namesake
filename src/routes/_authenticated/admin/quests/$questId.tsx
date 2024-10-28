import {
  Button,
  Form,
  RichTextEditor,
  Select,
  SelectItem,
  TextField,
} from "@/components";
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
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/quests/$questId")({
  component: AdminQuestDetailRoute,
});

const URLInput = memo(function URLInput({
  value,
  onChange,
  onRemove,
}: {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2">
      <TextField value={value} onChange={onChange} className="flex-1" />
      <Button type="button" variant="secondary" onPress={onRemove}>
        Remove
      </Button>
    </div>
  );
});

function AdminQuestDetailRoute() {
  const { questId } = Route.useParams();
  const quest = useQuery(api.quests.getQuest, {
    questId: questId as Id<"quests">,
  });
  const updateQuest = useMutation(api.quests.updateQuest);

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

  // Move the early returns after all hook calls
  if (quest === undefined) return null;
  if (quest === null) return <div>Form not found</div>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateQuest({
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
    <Form className="w-full" onSubmit={handleSubmit}>
      <Select
        label="Category"
        name="category"
        selectedKey={category}
        onSelectionChange={(value) => setCategory(value as string)}
        placeholder="Select a category"
        isRequired
      >
        {Object.entries(CATEGORIES).map(([key, { label, icon }]) => {
          const Icon = icon;
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
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
      <RichTextEditor markdown={content} onChange={setContent} />
      <div className="flex gap-2 justify-end">
        <Button type="submit" variant="primary">
          Save
        </Button>
      </div>
    </Form>
  );
}
