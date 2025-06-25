import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { CategoryItem } from "@convex/model/userQuestsModel";
import { useMutation, useQuery } from "convex/react";
import { Milestone, X } from "lucide-react";
import { toast } from "sonner";
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
import {
  CATEGORIES,
  type Category,
  GETTING_STARTED,
  type Status,
} from "@/constants";
import { useQuestsSidebar } from "./QuestsSidebarProvider";

export const MyQuests = () => {
  const { setActiveTab, setCategoryFilter } = useQuestsSidebar();

  // Use consolidated progress query
  const progress = useQuery(api.userQuests.getProgress);

  const questsByCategory = useQuery(
    api.userQuests.getByCategoryWithPlaceholders,
  );

  const removeQuest = useMutation(api.userQuests.deleteForever);
  const updateStatus = useMutation(api.userQuests.setStatus);
  const updateGettingStartedStatus = useMutation(
    api.userGettingStarted.setStatus,
  );
  const addDefaultPlaceholders = useMutation(
    api.userQuestPlaceholders.createDefault,
  );
  const dismissPlaceholder = useMutation(api.userQuestPlaceholders.dismiss);
  const restorePlaceholder = useMutation(api.userQuestPlaceholders.restore);

  const handleRemoveQuest = async (questId: Id<"quests">) => {
    try {
      await removeQuest({ questId });
    } catch (_err) {
      toast.error("Couldn't remove quest. Please try again.");
    }
  };

  const handleStatusChange = async (questId: Id<"quests">, status: Status) => {
    try {
      await updateStatus({ questId, status });
    } catch (_err) {
      toast.error("Couldn't update status. Please try again.");
    }
  };

  const handleGettingStartedStatusChange = async (status: Status) => {
    try {
      await updateGettingStartedStatus({ status });
    } catch (_err) {
      toast.error("Couldn't update getting started status. Please try again.");
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
    } catch (_err) {
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

  // Use progress data
  const hasQuests = progress ? progress.totalQuests > 0 : false;
  const gettingStartedStatus = progress?.gettingStartedStatus ?? "notStarted";

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

  const renderGettingStartedItem = () => {
    return (
      <NavItem
        key="getting-started"
        href={{
          to: "/quests/getting-started",
        }}
        size="large"
        icon={GETTING_STARTED.icon}
        actions={
          <StatusSelect
            status={gettingStartedStatus as Status}
            onChange={handleGettingStartedStatusChange}
            condensed
          />
        }
      >
        {GETTING_STARTED.label}
      </NavItem>
    );
  };

  if (!questsByCategory || questsByCategory.length === 0) {
    return (
      <Empty
        title="No quests"
        subtitle="Add quests to get started."
        icon={Milestone}
        className="h-full"
      >
        <div className="flex flex-col gap-2 items-center -mt-2">
          <Button onPress={() => addDefaultPlaceholders()}>
            Add recommended quests
          </Button>
          <Button variant="ghost" onPress={() => setActiveTab("all")}>
            Explore all quests
          </Button>
        </div>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {hasQuests && progress && (
        <div className="flex">
          <ProgressBar
            label="Progress"
            value={progress.completedQuests}
            maxValue={progress.totalQuests}
            valueLabel={
              <span className="text-normal">
                <span className="text-normal text-base font-medium mr-0.5 leading-none">
                  {progress.completedQuests}
                </span>{" "}
                <span className="text-dim opacity-60">/</span>{" "}
                <span className="text-dim">
                  {progress.totalQuests} complete
                </span>
              </span>
            }
          />
        </div>
      )}
      <Nav>
        {questsByCategory.map((group) => (
          <NavGroup key={group.category} label={group.label}>
            {group.label === "Core" &&
              progress?.hasGettingStarted &&
              renderGettingStartedItem()}
            {group.items.map((item) => renderItem(item, item.category))}
          </NavGroup>
        ))}
      </Nav>
    </div>
  );
};
