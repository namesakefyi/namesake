import {
  Badge,
  Button,
  Empty,
  Nav,
  NavGroup,
  NavItem,
  ProgressBar,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { StatusSelect } from "@/components/quests";
import { CATEGORIES, type Category, type Status } from "@/constants";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { CategoryItem } from "@convex/model/userQuestsModel";
import { useMutation, useQuery } from "convex/react";
import { Milestone, X } from "lucide-react";
import { toast } from "sonner";
import { useQuestsSidebar } from "./QuestsSidebarProvider";

export const MyQuests = () => {
  const { setActiveTab, setCategoryFilter } = useQuestsSidebar();
  const userQuests = useQuery(api.userQuests.count) ?? 0;
  const completedQuests = useQuery(api.userQuests.countCompleted) ?? 0;
  const questsByCategory = useQuery(
    api.userQuests.getByCategoryWithPlaceholders,
  );
  const removeQuest = useMutation(api.userQuests.deleteForever);
  const updateStatus = useMutation(api.userQuests.setStatus);
  const dismissPlaceholder = useMutation(api.userQuestPlaceholders.dismiss);
  const restorePlaceholder = useMutation(api.userQuestPlaceholders.restore);

  const handleRemoveQuest = async (questId: Id<"quests">) => {
    try {
      await removeQuest({ questId });
    } catch (err) {
      toast.error("Couldn't remove quest. Please try again.");
    }
  };

  const handleStatusChange = async (questId: Id<"quests">, status: Status) => {
    try {
      await updateStatus({ questId, status });
    } catch (err) {
      toast.error("Couldn't update status. Please try again.");
    }
  };

  const handleDismissPlaceholder = async (category: Category) => {
    try {
      await dismissPlaceholder({ category });
      const categoryInfo = CATEGORIES[category];
      toast(`Dismissed ${categoryInfo.label} suggestion`, {
        action: {
          label: "Undo",
          onClick: () => handleRestorePlaceholder(category),
        },
        duration: 8000,
      });
    } catch (err) {
      toast.error("Couldn't dismiss placeholder. Please try again.");
    }
  };

  const handleRestorePlaceholder = async (category: Category) => {
    await restorePlaceholder({ category });
  };

  const handlePlaceholderClick = (category: Category) => {
    setActiveTab("all");
    setCategoryFilter(category);
  };

  const hasQuests = userQuests > 0;

  // Render a single item (placeholder or quest)
  const renderItem = (item: CategoryItem, category: Category) => {
    const categoryInfo = CATEGORIES[category];

    if (item.type === "placeholder") {
      return (
        <NavItem
          key={`placeholder-${item.category}`}
          onPress={() => handlePlaceholderClick(category)}
          icon={categoryInfo.icon}
          size="large"
          className="border border-dashed border-dim cursor-pointer"
          actions={
            <TooltipTrigger>
              <Button
                variant="icon"
                size="small"
                icon={X}
                onPress={() => handleDismissPlaceholder(category)}
              />
              <Tooltip placement="right">Dismiss suggestion</Tooltip>
            </TooltipTrigger>
          }
        >
          {categoryInfo.label}
        </NavItem>
      );
    }

    const quest = item.data;
    return (
      <NavItem
        key={quest._id}
        href={{
          to: "/quests/$questSlug",
          params: { questSlug: quest.slug },
        }}
        size="large"
        icon={categoryInfo.icon}
        actions={
          <StatusSelect
            status={quest.status as Status}
            onChange={(status) => handleStatusChange(quest.questId, status)}
            onRemove={() => handleRemoveQuest(quest.questId)}
            condensed
          />
        }
      >
        {quest.title}
        {quest.jurisdiction && <Badge size="xs">{quest.jurisdiction}</Badge>}
      </NavItem>
    );
  };

  if (!questsByCategory || questsByCategory.length === 0) {
    return (
      <Empty
        title="No quests found"
        subtitle="Add quests to get started."
        icon={Milestone}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {hasQuests && (
        <div className="flex">
          <ProgressBar
            label="Progress"
            value={completedQuests}
            maxValue={userQuests}
            valueLabel={
              <span className="text-normal">
                <span className="text-normal text-base font-medium mr-0.5 leading-none">
                  {completedQuests}
                </span>{" "}
                <span className="text-dim opacity-60">/</span>{" "}
                <span className="text-dim">{userQuests} complete</span>
              </span>
            }
          />
        </div>
      )}
      <Nav>
        {questsByCategory.map((group) => (
          <NavGroup key={group.category} label={group.label}>
            {group.items.map((item) => renderItem(item, item.category))}
          </NavGroup>
        ))}
      </Nav>
    </div>
  );
};
