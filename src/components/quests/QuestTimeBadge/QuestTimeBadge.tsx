import {
  Badge,
  BadgeButton,
  Button,
  DialogTrigger,
  Form,
  NumberField,
  Popover,
  Select,
  SelectItem,
  TextField,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { TIME_UNITS, type TimeRequired, type TimeUnit } from "@/constants";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { HelpCircle, Pencil } from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";

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
      <div className="flex items-start gap-2">
        <NumberField
          label="Est. min time"
          className="w-24"
          isRequired
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
          isRequired
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
          isRequired
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

type QuestTimeBadgeProps = {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
};

export const QuestTimeBadge = ({
  quest,
  editable = false,
}: QuestTimeBadgeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [timeInput, setTimeInput] = useState<TimeRequired | null>(
    (quest?.timeRequired as TimeRequired) ?? null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setTimeRequired = useMutation(api.quests.setTimeRequired);

  if (!quest) return null;

  const handleCancel = () => {
    setTimeInput((quest.timeRequired as TimeRequired) ?? null);
    setIsEditing(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await setTimeRequired({
        timeRequired: timeInput ?? undefined,
        questId: quest._id,
      });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update time required");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quest) return null;

  const { timeRequired } = quest;

  const getFormattedTime = (timeRequired: TimeRequired) => {
    return timeRequired
      ? `${timeRequired.min}–${timeRequired.max} ${timeRequired.unit}`
      : "Unknown";
  };

  const formattedTime = getFormattedTime(timeRequired as TimeRequired);

  return (
    <Badge size="lg">
      {formattedTime}
      {timeRequired?.description && (
        <DialogTrigger>
          <TooltipTrigger>
            <BadgeButton label="Details" icon={HelpCircle} />
            <Tooltip>See details</Tooltip>
          </TooltipTrigger>
          <Popover placement="bottom" className="p-3">
            <p className="text-sm max-w-xs">{timeRequired.description}</p>
          </Popover>
        </DialogTrigger>
      )}
      {editable && (
        <DialogTrigger>
          <TooltipTrigger>
            <BadgeButton
              icon={Pencil}
              onPress={() => setIsEditing(true)}
              label="Edit time required"
            />
            <Tooltip>Edit time required</Tooltip>
          </TooltipTrigger>
          <Popover isOpen={isEditing} className="p-4">
            <Form onSubmit={handleSubmit} className="w-full">
              {timeInput && (
                <TimeRequiredInput
                  timeRequired={timeInput}
                  onChange={setTimeInput}
                />
              )}
              <div className="flex w-full justify-end gap-2">
                <Button variant="secondary" size="small" onPress={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  isSubmitting={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </Form>
          </Popover>
        </DialogTrigger>
      )}
    </Badge>
  );
};
