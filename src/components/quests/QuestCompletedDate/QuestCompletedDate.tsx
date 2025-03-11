import { TimeAgo } from "@/components/TimeAgo";
import { Label } from "@/components/common/Label";
import type { Doc } from "@convex/_generated/dataModel";
import { Check } from "lucide-react";

export function QuestCompletedDate({
  userQuest,
}: { userQuest: Doc<"userQuests"> }) {
  if (!userQuest || userQuest.status !== "complete" || !userQuest.completedAt)
    return null;

  const completedDate = new Date(userQuest.completedAt);

  return (
    <Label icon={Check}>
      Completed <TimeAgo date={completedDate} />
    </Label>
  );
}
