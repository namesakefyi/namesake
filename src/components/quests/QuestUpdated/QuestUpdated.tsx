import { TimeAgo } from "@/components/TimeAgo";
import { Label } from "@/components/common/Label";
import type { Doc } from "@convex/_generated/dataModel";
import { Clock } from "lucide-react";

interface QuestUpdatedProps {
  quest: Doc<"quests">;
}
export function QuestUpdated({ quest }: QuestUpdatedProps) {
  const updatedTime = quest.updatedAt ? (
    <TimeAgo date={new Date(quest.updatedAt)} />
  ) : (
    "some time ago"
  );

  return <Label icon={Clock}>Updated {updatedTime}</Label>;
}
