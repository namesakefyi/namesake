import { Empty } from "@/components/common";
import { QuestCard, QuestCardSkeleton } from "@/components/quests";
import type { Doc } from "@convex/_generated/dataModel";
import { Milestone } from "lucide-react";

interface QuestGridProps {
  quests?: Doc<"quests">[];
}

export const QuestGrid = ({ quests }: QuestGridProps) => {
  // Loading
  if (quests === undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: it's fine
          <QuestCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!quests.length) {
    return <Empty title="Couldn't find anything" icon={Milestone} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quests.map((quest) => (
        <QuestCard key={quest._id} quest={quest} />
      ))}
    </div>
  );
};
