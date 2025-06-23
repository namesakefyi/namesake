import type { Doc } from "@convex/_generated/dataModel";
import {
  QuestCategoryBadge,
  QuestCostsBadge,
  QuestJurisdictionBadge,
  QuestTimeBadge,
} from "@/components/quests";

interface QuestPageBadgesProps {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
}

export const QuestPageBadges = ({ quest, editable }: QuestPageBadgesProps) => {
  if (!quest) return null;

  return (
    <div className="flex gap-1 app-padding items-center overflow-x-auto h-10 py-2 -mt-2">
      <QuestCategoryBadge quest={quest} editable={editable} />
      <QuestJurisdictionBadge quest={quest} editable={editable} />
      <QuestCostsBadge quest={quest} editable={editable} />
      <QuestTimeBadge quest={quest} editable={editable} />
    </div>
  );
};
