import { Badge, Button, Tooltip, TooltipTrigger } from "@/components/common";
import { EditQuestTimeRequiredModal, StatTooltip } from "@/components/quests";
import type { Doc } from "@convex/_generated/dataModel";
import type { TimeRequired } from "@convex/constants";
import { Pencil } from "lucide-react";
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
        <StatTooltip>
          <p className="text-sm max-w-xs">{timeRequired.description}</p>
        </StatTooltip>
      )}
      {editable && (
        <>
          <TooltipTrigger>
            <Button
              variant="icon"
              size="small"
              icon={Pencil}
              onPress={() => setIsEditing(true)}
              aria-label="Edit time required"
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
