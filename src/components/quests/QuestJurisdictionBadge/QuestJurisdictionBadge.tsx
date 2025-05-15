import {
  Badge,
  BadgeButton,
  Menu,
  MenuItem,
  MenuTrigger,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import {
  ALL,
  type Category,
  JURISDICTIONS,
  type Jurisdiction,
} from "@/constants";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { toast } from "sonner";

const FEDERAL_CATEGORIES: Category[] = ["passport", "socialSecurity"];

type QuestJurisdictionBadgeProps = {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
  short?: boolean;
};

export const QuestJurisdictionBadge = ({
  quest,
  editable = false,
  short = false,
}: QuestJurisdictionBadgeProps) => {
  const [jurisdiction, setJurisdiction] = useState<Selection>(
    new Set(quest?.jurisdiction ? [quest.jurisdiction] : []),
  );
  const updateJurisdiction = useMutation(api.quests.setJurisdiction);

  if (!quest) return null;

  const handleChange = async (keys: Selection) => {
    if (keys !== ALL && keys.size === 1) {
      try {
        await updateJurisdiction({
          questId: quest._id,
          jurisdiction: [...keys][0] as Jurisdiction,
        });
        setJurisdiction(keys);
      } catch (error) {
        toast.error("Couldn't update state.");
      }
    }
  };

  const isFederal = FEDERAL_CATEGORIES.includes(quest.category as Category);
  const jurisdictionKey = [...jurisdiction][0] as Jurisdiction;

  const jurisdictionLabel = isFederal
    ? short
      ? "US"
      : "United States"
    : short
      ? jurisdictionKey
      : JURISDICTIONS[jurisdictionKey];

  return (
    <Badge size="lg">
      {jurisdictionLabel}
      {editable && !isFederal && (
        <MenuTrigger>
          <TooltipTrigger>
            <BadgeButton icon={Pencil} label="Edit jurisdiction" />
            <Tooltip>Edit state</Tooltip>
          </TooltipTrigger>
          <Menu
            selectionMode="single"
            onSelectionChange={handleChange}
            selectedKeys={jurisdiction}
          >
            {Object.entries(JURISDICTIONS).map(([value, label]) => (
              <MenuItem key={value} id={value}>
                {label}
              </MenuItem>
            ))}
          </Menu>
        </MenuTrigger>
      )}
    </Badge>
  );
};
