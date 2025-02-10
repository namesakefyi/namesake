import type { Doc } from "@convex/_generated/dataModel";
import { QuestUpdated } from "../QuestUpdated/QuestUpdated";

interface QuestPageFooterProps {
  quest: Doc<"quests">;
}

export function QuestPageFooter({ quest }: QuestPageFooterProps) {
  return (
    <div className="border-t border-gray-dim py-4">
      <QuestUpdated quest={quest} />
    </div>
  );
}
