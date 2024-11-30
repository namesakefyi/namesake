import {
  Button,
  Form,
  Modal,
  ModalHeader,
  NumberField,
  Select,
  SelectItem,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import {
  TIME_UNITS,
  type TimeRequired,
  type TimeUnit,
} from "@convex/constants";
import { useMutation } from "convex/react";
import { memo, useState } from "react";
import { toast } from "sonner";

type EditTimeRequiredModalProps = {
  quest: Doc<"quests">;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

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
          label="Est. min time"
          className="w-24"
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
          label="Est. max time"
          className="w-24"
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
          className="flex-1"
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

export const EditQuestTimeRequiredModal = ({
  quest,
  open,
  onOpenChange,
}: EditTimeRequiredModalProps) => {
  const [timeInput, setTimeInput] = useState<TimeRequired | null>(
    (quest.timeRequired as TimeRequired) ?? null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateTimeRequired = useMutation(api.quests.updateQuestTimeRequired);

  const handleCancel = () => {
    setTimeInput((quest.timeRequired as TimeRequired) ?? null);
    onOpenChange(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    updateTimeRequired({
      timeRequired: timeInput ?? undefined,
      questId: quest._id,
    })
      .then(() => {
        toast.success("Updated time required");
        onOpenChange(false);
      })
      .catch(() => {
        toast.error("Failed to update time required");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Modal isOpen={open}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader title="Edit time required" />
        {timeInput && (
          <TimeRequiredInput timeRequired={timeInput} onChange={setTimeInput} />
        )}
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onPress={handleCancel}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isDisabled={isSubmitting}>
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
