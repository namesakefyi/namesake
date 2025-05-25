import {
  Badge,
  BadgeButton,
  type BadgeProps,
  Menu,
  MenuItem,
  MenuSection,
  MenuSeparator,
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
import { CircleX, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { toast } from "sonner";

const FEDERAL_CATEGORIES: Category[] = ["passport", "socialSecurity"];

type QuestJurisdictionBadgeProps = {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
  short?: boolean;
} & Omit<BadgeProps, "children">;

export const QuestJurisdictionBadge = ({
  quest,
  editable = false,
  short = false,
  ...props
}: QuestJurisdictionBadgeProps) => {
  const [jurisdiction, setJurisdiction] = useState<Selection>(
    new Set(quest?.jurisdiction ? [quest.jurisdiction] : []),
  );
  const updateJurisdiction = useMutation(api.quests.setJurisdiction);

  if (!quest) return null;

  const handleRemove = () => {
    setJurisdiction(new Set());
    updateJurisdiction({
      questId: quest._id,
      jurisdiction: undefined,
    });
  };

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
  const hasJurisdiction = isFederal || [...jurisdiction][0] !== undefined;

  const getJurisdictionLabel = () => {
    if (isFederal) return short ? "US" : "United States";
    if (hasJurisdiction)
      return short
        ? [...jurisdiction][0]
        : (JURISDICTIONS[[...jurisdiction][0] as Jurisdiction] ?? "Unknown");
  };

  if (!hasJurisdiction && !editable) return null;

  return (
    <Badge size={props.size ?? "lg"} {...props}>
      {hasJurisdiction ? getJurisdictionLabel() : "Add state"}
      {editable && !isFederal && (
        <MenuTrigger>
          <TooltipTrigger>
            <BadgeButton
              icon={hasJurisdiction ? Pencil : Plus}
              label={hasJurisdiction ? "Edit state" : "Add state"}
            />
            <Tooltip>{hasJurisdiction ? "Edit state" : "Add state"}</Tooltip>
          </TooltipTrigger>
          <Menu placement="bottom end">
            <MenuSection
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={jurisdiction}
              onSelectionChange={handleChange}
              title="States"
            >
              {Object.entries(JURISDICTIONS).map(([value, label]) => (
                <MenuItem key={value} id={value}>
                  {label}
                </MenuItem>
              ))}
            </MenuSection>
            <MenuSeparator />
            <MenuItem onAction={handleRemove} icon={CircleX}>
              Remove
            </MenuItem>
          </Menu>
        </MenuTrigger>
      )}
    </Badge>
  );
};
