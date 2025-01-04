import { Badge } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Check } from "lucide-react";

interface PreviewOrAddedBadgeProps {
  quest: Doc<"quests">;
}

export function PreviewOrAddedBadge({ quest }: PreviewOrAddedBadgeProps) {
  const userQuest = useQuery(api.userQuests.getByQuestId, {
    questId: quest._id,
  });

  if (userQuest === undefined) return null;

  if (!userQuest) {
    return <Badge variant="warning">Preview</Badge>;
  }

  return (
    <Badge variant="success" icon={Check}>
      Added
    </Badge>
  );
}
