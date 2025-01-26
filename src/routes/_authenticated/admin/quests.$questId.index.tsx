import { PageHeader } from "@/components/app";
import {
  Badge,
  Button,
  Empty,
  Link,
  RichText,
  Select,
  SelectItem,
  TextField,
} from "@/components/common";
import { Step, Steps } from "@/components/quests";
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
import { Check, CircleHelp, Milestone, Trash } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Heading, type Key } from "react-aria-components";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

export const Route = createFileRoute("/_authenticated/admin/quests/$questId/")({
  component: AdminQuestDetailRoute,
});

const URLInput = memo(function URLInput({
  defaultValue,
  onChange,
  onRemove,
  hideLabel = false,
  editMode,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  hideLabel?: boolean;
  editMode?: boolean;
}) {
  return (
    <div className="flex gap-2 items-end">
      <TextField
        defaultValue={defaultValue}
        onChange={onChange}
        label={hideLabel ? undefined : "URL"}
        aria-label={hideLabel ? "URL" : undefined}
        className="flex-1"
      />
      {editMode && (
        <Button type="button" variant="icon" onPress={onRemove} icon={Trash} />
      )}
    </div>
  );
});

const QuestSteps = ({
  questId,
  steps,
  onSuccess,
}: {
  questId: Id<"quests">;
  steps: Id<"questSteps">[];
  onSuccess: () => void;
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const newStep = useMutation(api.quests.addStep);

  return (
    <AdminSection
      title="Steps"
      onEditToggle={
        steps.length > 0 ? () => setIsEditMode(!isEditMode) : undefined
      }
    >
      <div className="flex flex-col">
        {steps.length === 0 ? (
          <Empty
            icon={Milestone}
            title="No steps"
            button={{
              type: "button",
              variant: "secondary",
              onPress: () => newStep({ questId: questId as Id<"quests"> }),
              children: "Add Step",
            }}
          />
        ) : (
          <>
            <Steps>
              {steps.map((stepId) => (
                <QuestStep
                  key={stepId}
                  questStepId={stepId}
                  editMode={isEditMode}
                  onSuccess={onSuccess}
                />
              ))}
            </Steps>
            <Button
              type="button"
              variant="secondary"
              onPress={() => newStep({ questId: questId as Id<"quests"> })}
              className="ml-12"
            >
              Add Step
            </Button>
          </>
        )}
      </div>
    </AdminSection>
  );
};

const QuestStep = ({
  questStepId,
  editMode,
  onSuccess,
}: {
  questStepId: Id<"questSteps">;
  editMode?: boolean;
  onSuccess: () => void;
}) => {
  const step = useQuery(api.questSteps.getById, {
    questStepId: questStepId as Id<"questSteps">,
  });
  const deleteStep = useMutation(api.quests.deleteStep);
  const updateStep = useMutation(api.questSteps.update);

  const [debouncedStep, setDebouncedStep] = useState<{
    title: string | undefined;
    content: string | undefined;
  } | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
  useEffect(() => {
    if (step && !debouncedStep) {
      setDebouncedStep({
        title: step.title,
        content: step.content,
      });
    }
  }, [step]);

  const debounce = useDebouncedCallback((newStep) => {
    setDebouncedStep(newStep);
  }, 1000);

  useEffect(() => {
    if (
      debouncedStep &&
      step &&
      (debouncedStep.title !== step.title ||
        debouncedStep.content !== step.content)
    ) {
      try {
        updateStep({
          questStepId,
          title: debouncedStep.title,
          content: debouncedStep.content,
        });
        onSuccess();
      } catch (error) {
        toast.error("Couldn't update step.");
      }
    }
  }, [debouncedStep, step, questStepId, updateStep, onSuccess]);

  if (step === undefined) return null;

  const handleDelete = () => {
    deleteStep({
      questId: step?.questId as Id<"quests">,
      stepId: step?._id as Id<"questSteps">,
    });
  };

  return (
    <Step className="w-full">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-4 flex-1 -mt-1.5">
          <TextField
            aria-label="Title"
            size="large"
            defaultValue={step?.title}
            onChange={(title) => debounce({ ...debouncedStep, title })}
          />
          <RichText
            initialContent={step?.content}
            onChange={(content) => debounce({ ...debouncedStep, content })}
          />
        </div>
        {editMode && (
          <Button
            type="button"
            variant="icon"
            aria-label="Delete step"
            icon={Trash}
            className="-mt-0.5"
            onPress={handleDelete}
          />
        )}
      </div>
    </Step>
  );
};

const EditQuestTitle = ({
  questId,
  title,
  onSuccess,
}: {
  questId: Id<"quests">;
  title: string;
  onSuccess: () => void;
}) => {
  const [debouncedTitle, setDebouncedTitle] = useState(title);
  const updateTitle = useMutation(api.quests.setTitle);

  const debounce = useDebouncedCallback((newTitle) => {
    setDebouncedTitle(newTitle);
  }, 1000);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
  useEffect(() => {
    if (debouncedTitle !== undefined) {
      try {
        updateTitle({ questId, title: debouncedTitle });
        onSuccess();
      } catch (error) {
        toast.error("Couldn't update title.");
      }
    }
  }, [debouncedTitle]);

  return (
    <TextField
      label="Title"
      defaultValue={title}
      onChange={(value) => debounce(value)}
      className="flex-1"
    />
  );
};

const EditQuestJurisdiction = ({
  questId,
  jurisdiction,
  onSuccess,
}: {
  questId: Id<"quests">;
  jurisdiction: Jurisdiction;
  onSuccess: () => void;
}) => {
  const updateJurisdiction = useMutation(api.quests.setJurisdiction);

  const handleSelection = (jurisdiction: Key) => {
    if (jurisdiction !== undefined) {
      try {
        updateJurisdiction({
          questId,
          jurisdiction: jurisdiction as Jurisdiction,
        });
        onSuccess();
      } catch (error) {
        toast.error("Couldn't update state.");
      }
    }
  };

  return (
    <Select
      label="State"
      name="jurisdiction"
      selectedKey={jurisdiction}
      onSelectionChange={handleSelection}
      placeholder="Select a state"
      className="flex-[0.5]"
    >
      {Object.entries(JURISDICTIONS).map(([value, label]) => (
        <SelectItem key={value} id={value}>
          {label}
        </SelectItem>
      ))}
    </Select>
  );
};

const EditQuestCategory = ({
  questId,
  category,
  onSuccess,
}: {
  questId: Id<"quests">;
  category: Category;
  onSuccess: () => void;
}) => {
  const updateCategory = useMutation(api.quests.setCategory);

  const handleSelection = (category: Key) => {
    if (category !== undefined) {
      try {
        updateCategory({ questId, category: category as Category });
        onSuccess();
      } catch (error) {
        toast.error("Couldn't update category.");
      }
    }
  };

  return (
    <Select
      label="Category"
      name="category"
      selectedKey={category}
      onSelectionChange={handleSelection}
      placeholder="Select a category"
      className="flex-[0.5]"
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
  );
};

const AdminSection = ({
  title,
  children,
  onEditToggle,
}: {
  title: string;
  children: any;
  onEditToggle?: () => void;
}) => {
  return (
    <section className="flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between gap-2 border-b border-gray-dim pb-1">
        <Heading className="text-lg font-medium">{title}</Heading>
        {onEditToggle && (
          <Button variant="ghost" onPress={onEditToggle} size="small">
            Edit
          </Button>
        )}
      </div>
      {children}
    </section>
  );
};

const QuestLinks = ({
  questId,
  urls,
  onSuccess,
}: {
  questId: Id<"quests">;
  urls: string[];
  onSuccess: () => void;
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [debouncedUrls, setDebouncedUrls] = useState(urls);
  const updateUrls = useMutation(api.quests.setUrls);

  const debounce = useDebouncedCallback((newUrls) => {
    setDebouncedUrls(newUrls);
  }, 1000);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
  useEffect(() => {
    if (debouncedUrls !== undefined) {
      try {
        updateUrls({ questId, urls: debouncedUrls });
        onSuccess();
      } catch (error) {
        toast.error("Couldn't update links.");
      }
    }
  }, [debouncedUrls]);

  return (
    <AdminSection
      title="Links"
      onEditToggle={
        urls.length > 0 ? () => setIsEditMode(!isEditMode) : undefined
      }
    >
      <div className="flex flex-col gap-2">
        {urls.map((url, index) => (
          <URLInput
            // biome-ignore lint/suspicious/noArrayIndexKey:
            key={index}
            defaultValue={url}
            onChange={(value) => {
              const newUrls = [...urls];
              newUrls[index] = value;
              debounce(newUrls);
            }}
            onRemove={() => {
              const newUrls = urls.filter((_, i) => i !== index);
              setDebouncedUrls(newUrls);
            }}
            hideLabel={index > 0}
            editMode={isEditMode}
          />
        ))}
        <Button
          type="button"
          variant="secondary"
          onPress={() => setDebouncedUrls([...urls, ""])}
        >
          Add URL
        </Button>
      </div>
    </AdminSection>
  );
};

function AdminQuestDetailRoute() {
  const { questId } = Route.useParams();
  const quest = useQuery(api.quests.getById, {
    questId: questId as Id<"quests">,
  });
  const [didUpdate, setDidUpdate] = useState(false);

  useEffect(() => {
    if (didUpdate) {
      setTimeout(() => {
        setDidUpdate(false);
      }, 4000);
    }
  }, [didUpdate]);

  if (quest === undefined) return null;
  if (quest === null) return <div>Form not found</div>;

  return (
    <>
      <PageHeader title={quest.title}>
        {didUpdate && (
          <Badge icon={Check} variant="success">
            Changes saved
          </Badge>
        )}
        <Link
          href={{ to: "/$questSlug", params: { questSlug: quest.slug } }}
          button={{ variant: "secondary", size: "small" }}
        >
          View quest
        </Link>
      </PageHeader>
      <AdminSection title="Basic Info">
        <div className="flex items-start gap-4">
          <EditQuestTitle
            questId={questId as Id<"quests">}
            title={quest.title}
            onSuccess={() => setDidUpdate(true)}
          />
          <EditQuestJurisdiction
            questId={questId as Id<"quests">}
            jurisdiction={quest.jurisdiction as Jurisdiction}
            onSuccess={() => setDidUpdate(true)}
          />
          <EditQuestCategory
            questId={questId as Id<"quests">}
            category={quest.category as Category}
            onSuccess={() => setDidUpdate(true)}
          />
        </div>
      </AdminSection>
      <QuestSteps
        questId={questId as Id<"quests">}
        steps={quest?.steps ?? []}
        onSuccess={() => setDidUpdate(true)}
      />
      <QuestLinks
        questId={questId as Id<"quests">}
        urls={quest?.urls ?? []}
        onSuccess={() => setDidUpdate(true)}
      />
    </>
  );
}
