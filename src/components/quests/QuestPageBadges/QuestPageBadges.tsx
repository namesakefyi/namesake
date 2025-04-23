import {
  QuestCategoryBadge,
  QuestCostsBadge,
  QuestJurisdictionBadge,
  QuestTimeBadge,
} from "@/components/quests/badges";
import type { Doc } from "@convex/_generated/dataModel";

interface QuestPageBadgesProps {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
}

export const QuestPageBadges = ({ quest, editable }: QuestPageBadgesProps) => {
  if (!quest) return null;

  return (
    <div className="flex gap-1 app-padding items-center overflow-x-auto pb-2">
      <QuestCategoryBadge quest={quest} editable={editable} />
      <QuestJurisdictionBadge quest={quest} editable={editable} />
      <QuestCostsBadge quest={quest} editable={editable} />
      <QuestTimeBadge quest={quest} editable={editable} />
    </div>
  );
};
