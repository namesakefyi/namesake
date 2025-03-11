import type { Doc } from "@convex/_generated/dataModel";
import { QuestCompletedDate } from "../QuestCompletedDate/QuestCompletedDate";
import { QuestUpdated } from "../QuestUpdated/QuestUpdated";

interface QuestPageFooterProps {
  quest: Doc<"quests">;
  userQuest?: Doc<"userQuests"> | null;
}

export function QuestPageFooter({ quest, userQuest }: QuestPageFooterProps) {
  return (
    <footer className="border-t border-gray-dim py-4 flex items-center">
      <div className="flex-1">
        {userQuest && <QuestCompletedDate userQuest={userQuest} />}
      </div>
      <QuestUpdated quest={quest} />
    </footer>
  );
}
