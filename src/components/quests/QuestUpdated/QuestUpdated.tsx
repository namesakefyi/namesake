import { TimeAgo } from "@/components/TimeAgo";
import type { Doc } from "@convex/_generated/dataModel";

interface QuestUpdatedProps {
  quest: Doc<"quests">;
}
export function QuestUpdated({ quest }: QuestUpdatedProps) {
  const updatedTime = quest.updatedAt ? (
    <TimeAgo date={new Date(quest.updatedAt)} />
  ) : (
    "Never"
  );

  return <span className="text-gray-dim text-sm">Updated {updatedTime}</span>;
}
