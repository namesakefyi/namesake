import {
  Badge,
  BadgeButton,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import type { Doc } from "@convex/_generated/dataModel";
import { JURISDICTIONS } from "@convex/constants";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { EditQuestJurisdictionModal } from "../EditQuestJurisdictionModal/EditQuestJurisdictionModal";

type QuestJurisdictionProps = {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
};

export const QuestJurisdiction = ({
  quest,
  editable = false,
}: QuestJurisdictionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!quest) return null;

  function getJurisdictionLabel(quest: Doc<"quests">) {
    const { jurisdiction, category } = quest;
    if (category === "passport" || category === "socialSecurity") {
      return "United States";
    }

    if (jurisdiction) {
      return JURISDICTIONS[jurisdiction as keyof typeof JURISDICTIONS];
    }
  }

  return (
    <Badge>
      {getJurisdictionLabel(quest)}
      {editable && (
        <>
          <TooltipTrigger>
            <BadgeButton
              icon={Pencil}
              onPress={() => setIsEditing(true)}
              label="Edit jurisdiction"
            />
            <Tooltip>Edit state</Tooltip>
          </TooltipTrigger>
          <EditQuestJurisdictionModal
            quest={quest}
            open={isEditing}
            onOpenChange={setIsEditing}
          />
        </>
      )}
    </Badge>
  );
};
