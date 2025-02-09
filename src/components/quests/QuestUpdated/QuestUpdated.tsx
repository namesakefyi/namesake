import { StatGroup } from "@/components/quests";
import type { Doc } from "@convex/_generated/dataModel";

interface QuestUpdatedProps {
  quest: Doc<"quests">;
}

export function QuestUpdated({ quest }: QuestUpdatedProps) {
  const updated = quest.updatedAt
    ? new Date(quest.updatedAt).toLocaleDateString(navigator.language, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Never";

  return <StatGroup label="Last Updated" value={updated} />;
}
