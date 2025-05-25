import {
  Badge,
  BadgeButton,
  type BadgeProps,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { CATEGORIES, type Category } from "@/constants";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { CircleHelp, Pencil } from "lucide-react";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { toast } from "sonner";

type QuestCategoryBadgeProps = {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
} & Omit<BadgeProps, "children">;

export const QuestCategoryBadge = ({
  quest,
  editable = false,
  ...props
}: QuestCategoryBadgeProps) => {
  const [category, setCategory] = useState<Selection>(
    new Set(quest?.category ? [quest.category] : undefined),
  );
  const updateCategory = useMutation(api.quests.setCategory);

  if (!quest) return null;

  if (CATEGORIES[quest.category as Category]?.isCore && !editable) {
    return null;
  }

  const handleChange = async (keys: Selection) => {
    try {
      await updateCategory({
        questId: quest._id,
        category: [...keys][0] as Category,
      });
      setCategory(keys);
    } catch (error) {
      toast.error("Couldn't update state.");
    }
  };

  return (
    <Badge
      size={props.size ?? "lg"}
      icon={CATEGORIES[quest.category as Category]?.icon}
      {...props}
    >
      {CATEGORIES[quest.category as Category]?.label ?? "Unknown"}
      {editable && (
        <MenuTrigger>
          <TooltipTrigger>
            <BadgeButton icon={Pencil} label="Edit category" />
            <Tooltip>Edit category</Tooltip>
          </TooltipTrigger>
          <Menu>
            <MenuSection
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={category}
              onSelectionChange={handleChange}
              title="Categories"
            >
              {Object.entries(CATEGORIES).map(([key, { label, icon }]) => {
                const Icon = icon ?? CircleHelp;
                return (
                  <MenuItem key={key} id={key} textValue={key} icon={Icon}>
                    {label}
                  </MenuItem>
                );
              })}
            </MenuSection>
          </Menu>
        </MenuTrigger>
      )}
    </Badge>
  );
};
