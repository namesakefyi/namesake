import {
  Button,
  Form,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  RichText,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Step, Steps } from "../Steps/Steps";

type QuestStepFormProps = {
  step: Doc<"questSteps">;
  onSave: () => void;
  onCancel: () => void;
};

const QuestStepForm = ({ step, onSave, onCancel }: QuestStepFormProps) => {
  const [title, setTitle] = useState(step.title);
  const [content, setContent] = useState(step.content);
  const [button, setButton] = useState(step.button);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStep = useMutation(api.questSteps.update);

  const handleAddButton = () => {
    setButton({
      text: "",
      url: "",
    });
  };

  const handleCancel = () => {
    setTitle(step.title);
    setContent(step.content);
    setButton(step.button);
    onCancel();
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await updateStep({
        questStepId: step._id,
        title,
        content,
        button,
      });
      onSave();
    } catch (error) {
      toast.error("Couldn't update step.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Step>
      <Form className="gap-2">
        <TextField
          value={title}
          onChange={setTitle}
          size="large"
          aria-label="Title"
        />
        <RichText initialContent={content} onChange={setContent} />
        {button && (
          <div className="flex gap-2 items-end">
            <TextField
              value={button.text}
              onChange={(value) => setButton({ ...button, text: value })}
              label="Button text"
            />
            <TextField
              value={button.url}
              onChange={(value) => setButton({ ...button, url: value })}
              label="Button url"
              className="flex-1"
              type="url"
            />
            <Button
              onPress={() => setButton(undefined)}
              aria-label="Remove button"
              icon={Trash}
              variant="icon"
            />
          </div>
        )}
        <div className="flex gap-2 justify-between">
          {!button && <Button onPress={handleAddButton}>Add button</Button>}
          <div className="ml-auto flex gap-2">
            <Button onPress={handleCancel} isDisabled={isUpdating}>
              Cancel
            </Button>
            <Button
              onPress={handleSave}
              variant="primary"
              isDisabled={isUpdating}
            >
              {isUpdating ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </Form>
    </Step>
  );
};

type QuestStepProps = {
  step: Doc<"questSteps">;
  editable?: boolean;
};

export const QuestStep = ({ step, editable = false }: QuestStepProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const deleteStep = useMutation(api.quests.deleteStep);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteStep({
      questId: step.questId,
      stepId: step._id,
    });
  };

  if (isEditing) {
    return (
      <QuestStepForm step={step} onSave={handleSave} onCancel={handleCancel} />
    );
  }

  const stepActions = editable ? (
    <MenuTrigger>
      <Button
        variant="icon"
        icon={MoreHorizontal}
        aria-label="Actions"
        size="small"
      />
      <Menu placement="bottom end">
        <MenuItem onAction={handleEdit}>Edit step</MenuItem>
        <MenuItem onAction={handleDelete}>Delete step</MenuItem>
      </Menu>
    </MenuTrigger>
  ) : null;

  return (
    <Step title={step.title} actions={stepActions}>
      <RichText initialContent={step.content} editable={false} />
      {step.button && (
        <Link
          href={step.button.url}
          button={{ variant: "secondary", size: "large" }}
        >
          {step.button.text}
        </Link>
      )}
    </Step>
  );
};

type QuestStepsProps = {
  quest: Doc<"quests">;
  editable?: boolean;
};

export const QuestSteps = ({ quest, editable = false }: QuestStepsProps) => {
  const addStep = useMutation(api.quests.addStep);

  const steps = useQuery(api.questSteps.getByIds, {
    questStepIds: quest.steps,
  });

  const handleAddStep = async () => {
    await addStep({
      questId: quest._id,
      title: "New step",
    });
  };

  return (
    <>
      {steps && (
        <Steps>
          {steps
            .filter((step) => step !== null)
            .map((step) => (
              <QuestStep key={step._id} step={step} editable={editable} />
            ))}
        </Steps>
      )}
      {editable && <Button onPress={handleAddStep}>Add step</Button>}
    </>
  );
};
