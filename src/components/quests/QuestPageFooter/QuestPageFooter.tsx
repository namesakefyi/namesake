import { IconText } from "@/components/common";
import { TimeAgo } from "@/components/common/TimeAgo/TimeAgo";
import type { Doc } from "@convex/_generated/dataModel";
import { Check, Clock } from "lucide-react";

interface QuestPageFooterProps {
  quest: Doc<"quests">;
  userQuest?: Doc<"userQuests"> | null;
}

function QuestCompletedDate({ userQuest }: { userQuest: Doc<"userQuests"> }) {
  if (!userQuest || userQuest.status !== "complete" || !userQuest.completedAt)
    return null;

  const completedDate = new Date(userQuest.completedAt);

  return (
    <IconText icon={Check}>
      Completed <TimeAgo date={completedDate} />
    </IconText>
  );
}

interface QuestUpdatedProps {
  quest: Doc<"quests">;
}
export function QuestUpdated({ quest }: QuestUpdatedProps) {
  const updatedTime = quest.updatedAt ? (
    <TimeAgo date={new Date(quest.updatedAt)} />
  ) : (
    "some time ago"
  );

  return <IconText icon={Clock}>Updated {updatedTime}</IconText>;
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
