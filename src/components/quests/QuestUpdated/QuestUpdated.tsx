import { TimeAgo } from "@/components/common";
import type { Doc } from "@convex/_generated/dataModel";

interface QuestUpdatedProps {
  quest: Doc<"quests">;
}

export function QuestUpdated({ quest }: QuestUpdatedProps) {
  return (
    <span className="text-gray-dim text-sm">
      Updated <TimeAgo date={new Date(quest.updatedAt)} />
    </span>
  );
}
