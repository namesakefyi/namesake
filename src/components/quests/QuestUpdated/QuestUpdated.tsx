import { Button, Tooltip } from "@/components/common";
import { TooltipTrigger } from "@/components/common/Tooltip/Tooltip";
import type { Doc } from "@convex/_generated/dataModel";
import RelativeTime from "react-relative-time";

interface QuestUpdatedProps {
  quest: Doc<"quests">;
}
export function QuestUpdated({ quest }: QuestUpdatedProps) {
  const updatedTime = quest.updatedAt ? (
    <RelativeTime value={new Date(quest.updatedAt)} />
  ) : (
    "Never"
  );

  return (
    <TooltipTrigger>
      <Button variant="ghost" className="text-gray-dim text-sm">
        Updated {updatedTime}
      </Button>
      <Tooltip>
        {quest.updatedAt
          ? new Date(quest.updatedAt).toLocaleString()
          : "Never updated"}
      </Tooltip>
    </TooltipTrigger>
  );
}
