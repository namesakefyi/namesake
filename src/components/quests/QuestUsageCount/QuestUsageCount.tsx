import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { StatGroup } from "../StatGroup";

interface QuestUsageCountProps {
  quest: Doc<"quests">;
}

export function QuestUsageCount({ quest }: QuestUsageCountProps) {
  const count = useQuery(api.userQuests.countGlobalUsage, {
    questId: quest._id as Id<"quests">,
  });

  return (
    <StatGroup
      label="Used by"
      value={count === undefined ? "" : count?.toString() || "Unknown"}
    />
  );
}
