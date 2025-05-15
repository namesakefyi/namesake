import {
  Button,
  Link,
  Skeleton,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import {
  QuestCategoryBadge,
  QuestCostsBadge,
  QuestJurisdictionBadge,
  QuestTimeBadge,
  StatusSelect,
} from "@/components/quests";
import { CATEGORIES, type Category, type Status } from "@/constants";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { CircleHelp, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface QuestCardProps {
  quest: Doc<"quests">;
}

export const QuestCard = ({ quest }: QuestCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userQuest = useQuery(api.userQuests.getByQuestId, {
    questId: quest._id,
  });
  const addQuest = useMutation(api.userQuests.create);
  const removeQuest = useMutation(api.userQuests.deleteForever);
  const updateStatus = useMutation(api.userQuests.setStatus);

  const Icon = quest.category
    ? (CATEGORIES[quest.category as Category]?.icon ?? CircleHelp)
    : CircleHelp;

  const handleAddQuest = async () => {
    try {
      setIsSubmitting(true);
      await addQuest({ questId: quest._id });
      toast.success("Added to your list");
    } catch (err) {
      toast.error("Failed to update quest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveQuest = async () => {
    try {
      setIsSubmitting(true);
      await removeQuest({ questId: quest._id });
      toast.success("Removed from your list");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status: Status) => {
    try {
      await updateStatus({ questId: quest._id, status });
    } catch (err) {
      toast.error("Couldn't update status. Please try again.");
    }
  };

  return (
    <div className="rounded-lg h-24 border border-gray-dim flex flex-col">
      <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center px-4 pt-3.5">
        <Icon className="text-gray-dim shrink-0 stroke-[1.5px] size-6" />
        <Link
          href={{
            to: "/quests/$questSlug",
            params: { questSlug: quest.slug },
          }}
          className="no-underline text-gray-dim hover:text-gray-normal text-xl font-medium truncate"
        >
          {quest.title}
        </Link>
        {userQuest ? (
          <StatusSelect
            status={userQuest.status as Status}
            onChange={handleStatusChange}
            onRemove={handleRemoveQuest}
            condensed
          />
        ) : (
          <TooltipTrigger>
            <Button
              variant="icon"
              size="small"
              onPress={handleAddQuest}
              isSubmitting={isSubmitting}
              icon={Plus}
            />
            <Tooltip>Add to my list</Tooltip>
          </TooltipTrigger>
        )}
      </div>
      <div className="flex gap-1 items-start overflow-x-auto px-4 py-2 flex-1">
        <QuestCategoryBadge quest={quest} />
        <QuestJurisdictionBadge quest={quest} short />
        <QuestCostsBadge quest={quest} />
        <QuestTimeBadge quest={quest} />
      </div>
    </div>
  );
};

export const QuestCardSkeleton = () => {
  return <Skeleton className="rounded-lg h-24" />;
};
