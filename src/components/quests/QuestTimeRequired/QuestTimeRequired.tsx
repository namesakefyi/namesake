import { StatGroup, StatPopover } from "@/components/quests";
import type { TimeRequired } from "@convex/constants";

type QuestTimeRequiredProps = {
  timeRequired: TimeRequired;
};

export const QuestTimeRequired = ({ timeRequired }: QuestTimeRequiredProps) => {
  const getFormattedTime = (timeRequired: TimeRequired) => {
    return timeRequired
      ? `${timeRequired.min}–${timeRequired.max} ${timeRequired.unit}`
      : "Unknown";
  };

  const formattedTime = getFormattedTime(timeRequired);

  return (
    <StatGroup label="Time" value={formattedTime}>
      {timeRequired.description && (
        <StatPopover tooltip="See details">
          <p className="text-sm max-w-xs">{timeRequired.description}</p>
        </StatPopover>
      )}
    </StatGroup>
  );
};
