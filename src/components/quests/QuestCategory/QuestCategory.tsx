import {
  Badge,
  BadgeButton,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import type { Doc } from "@convex/_generated/dataModel";
import { CATEGORIES, type Category } from "@convex/constants";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { EditQuestCategoryModal } from "../EditQuestCategoryModal/EditQuestCategoryModal";

type QuestCategoryProps = {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
};

export const QuestCategory = ({
  quest,
  editable = false,
}: QuestCategoryProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!quest || !quest.category) return null;

  if (CATEGORIES[quest.category as Category].isCore && !editable) {
    return null;
  }

  return (
    <Badge>
      {CATEGORIES[quest.category as Category].label}
      {editable && (
        <>
          <TooltipTrigger>
            <BadgeButton
              icon={Pencil}
              onPress={() => setIsEditing(true)}
              label="Edit category"
            />
            <Tooltip>Edit category</Tooltip>
          </TooltipTrigger>
          <EditQuestCategoryModal
            quest={quest}
            open={isEditing}
            onOpenChange={setIsEditing}
          />
        </>
      )}
    </Badge>
  );
};
