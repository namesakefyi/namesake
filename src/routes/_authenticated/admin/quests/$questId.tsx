import { PageHeader } from "@/components/app";
import {
  AnimateChangeInHeight,
  Button,
  Checkbox,
  Form,
  NumberField,
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
  type Cost,
  DEFAULT_TIME_REQUIRED,
  JURISDICTIONS,
  type Jurisdiction,
  TIME_UNITS,
  type TimeRequired,
  type TimeUnit,
} from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { CircleHelp } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/quests/$questId")({
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
        className="flex-1 w-96"
      />
      <Button type="button" variant="secondary" onPress={onRemove}>
        Remove
      </Button>
    </div>
  );
});

const CostInput = memo(function CostInput({
  cost,
  onChange,
  onRemove,
  hideLabel = false,
}: {
  cost: Cost;
  onChange: (cost: Cost) => void;
  onRemove: (cost: Cost) => void;
  hideLabel?: boolean;
}) {
  return (
    <div className="flex items-end gap-2">
      <NumberField
        label={hideLabel ? undefined : "Cost"}
        aria-label={hideLabel ? "Cost" : undefined}
        className="w-28"
        prefix="$"
        value={cost.cost}
        onChange={(value) =>
          onChange({ cost: value, description: cost.description })
        }
      />
      <TextField
        label={hideLabel ? undefined : "For"}
        aria-label={hideLabel ? "For" : undefined}
        className="w-80"
        value={cost.description}
        onChange={(value) => onChange({ cost: cost.cost, description: value })}
      />
      <Button type="button" variant="secondary" onPress={() => onRemove(cost)}>
        Remove
      </Button>
    </div>
  );
});

const CostsInput = memo(function CostsInput({
  costs,
  onChange,
}: {
  costs: Cost[] | null;
  onChange: (costs: Cost[] | null) => void;
}) {
  return (
    <AnimateChangeInHeight>
      <Checkbox
        label="Free"
        isSelected={!costs}
        onChange={(isSelected) =>
          onChange(isSelected ? null : [{ cost: 0, description: "" }])
        }
      />
      {costs && (
        <div className="flex flex-col gap-2 mt-4">
          {costs.map((cost, index) => (
            <CostInput
              // biome-ignore lint/suspicious/noArrayIndexKey:
              key={index}
              cost={cost}
              onChange={(value) => {
                const newCosts = [...costs];
                newCosts[index] = value;
                onChange(newCosts);
              }}
              onRemove={() => {
                onChange(costs.filter((_, i) => i !== index));
              }}
              hideLabel={index > 0}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            onPress={() =>
              onChange([...(costs ?? []), { cost: 0, description: "" }])
            }
          >
            Add cost
          </Button>
        </div>
      )}
    </AnimateChangeInHeight>
  );
});

const TimeRequiredInput = memo(function TimeRequiredInput({
  timeRequired,
  onChange,
}: {
  timeRequired: TimeRequired;
  onChange: (timeRequired: TimeRequired) => void;
}) {
  if (!timeRequired) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-2">
        <NumberField
          label="Min. Req. Time"
          className="w-28"
          value={timeRequired?.min}
          maxValue={Math.max(timeRequired.max, 60)}
          onChange={(value) =>
            onChange({
              ...timeRequired,
              min: value,
            })
          }
        />
        <NumberField
          label="Max Req. Time"
          className="w-28"
          value={timeRequired.max}
          minValue={Math.min(timeRequired.min, 1)}
          onChange={(value) =>
            onChange({
              ...timeRequired,
              max: value,
            })
          }
        />
        <Select
          label="Unit"
          className="w-40"
          selectedKey={timeRequired.unit}
          onSelectionChange={(key) =>
            onChange({
              ...timeRequired,
              unit: key as TimeUnit,
            })
          }
        >
          {Object.entries(TIME_UNITS).map(([key, unit]) => (
            <SelectItem key={key} id={key}>
              {unit.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <TextField
        label="Description"
        description="Add optional context about the time required."
        className="w-full"
        value={timeRequired.description ?? ""}
        onChange={(value) =>
          onChange({
            ...timeRequired,
            description: value || undefined,
          })
        }
      />
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
  const [costs, setCosts] = useState<Cost[] | null>(null);
  const [timeRequired, setTimeRequired] = useState<TimeRequired>(
    DEFAULT_TIME_REQUIRED,
  );
  const [urls, setUrls] = useState<string[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (quest) {
      setTitle(quest.title ?? "");
      setCategory(quest.category as Category);
      setJurisdiction(quest.jurisdiction as Jurisdiction);
      setCosts(quest.costs as Cost[]);
      setTimeRequired(quest.timeRequired as TimeRequired);
      setUrls(quest.urls ?? []);
      setContent(quest.content ?? "");
    }
  }, [quest]);

  if (quest === undefined) return null;
  if (quest === null) return <div>Form not found</div>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateQuest({
      questId: questId as Id<"quests">,
      title,
      category: category ?? undefined,
      jurisdiction: jurisdiction ?? undefined,
      costs: costs ?? undefined,
      timeRequired: timeRequired ?? undefined,
      urls: urls ?? undefined,
      content,
    }).then(() => {
      toast(`Updated quest: ${title}`);
    });
  };

  return (
    <>
      <PageHeader title={title} />
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
        <CostsInput costs={costs} onChange={setCosts} />
        <TimeRequiredInput
          timeRequired={timeRequired}
          onChange={setTimeRequired}
        />
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
