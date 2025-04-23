import {
  Badge,
  BadgeButton,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { EditQuestTimeRequiredModal } from "@/components/quests";
import type { Doc } from "@convex/_generated/dataModel";
import type { TimeRequired } from "@convex/constants";
import { HelpCircle, Pencil } from "lucide-react";
import { useState } from "react";

type QuestTimeRequiredProps = {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
};

export const QuestTimeRequired = ({
  quest,
  editable = false,
}: QuestTimeRequiredProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!quest) return null;

  const { timeRequired } = quest;

  const getFormattedTime = (timeRequired: TimeRequired) => {
    return timeRequired
      ? `${timeRequired.min}–${timeRequired.max} ${timeRequired.unit}`
      : "Unknown";
  };

  const formattedTime = getFormattedTime(timeRequired as TimeRequired);

  return (
    <Badge>
      {formattedTime}
      {timeRequired?.description && (
        <TooltipTrigger>
          <BadgeButton label="Details" icon={HelpCircle} />
          <Tooltip>
            <p className="text-sm max-w-xs">{timeRequired.description}</p>
          </Tooltip>
        </TooltipTrigger>
      )}
      {editable && (
        <>
          <TooltipTrigger>
            <BadgeButton
              icon={Pencil}
              onPress={() => setIsEditing(true)}
              label="Edit time required"
            />
            <Tooltip>Edit time required</Tooltip>
          </TooltipTrigger>
          <EditQuestTimeRequiredModal
            quest={quest}
            open={isEditing}
            onOpenChange={setIsEditing}
          />
        </>
      )}
    </Badge>
  );
};
