import type { TimeRequired } from "@convex/constants";
import { StatGroup, type StatGroupProps } from "../StatGroup/StatGroup";

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

  const timeRequiredPopover: StatGroupProps["popover"] = timeRequired
    ? {
        tooltip: "See details",
        content: <p className="text-sm max-w-xs">{timeRequired.description}</p>,
      }
    : undefined;

  return (
    <StatGroup
      label="Time"
      value={formattedTime}
      popover={timeRequiredPopover}
    />
  );
};
