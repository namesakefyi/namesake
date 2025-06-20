import {
  Badge,
  Button,
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
import { useMutation, useQuery } from "convex/react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useQuestsSidebar } from "./QuestsSidebarProvider";

export const MyQuests = () => {
  const { setActiveTab, setCategoryFilter } = useQuestsSidebar();
  const userQuests = useQuery(api.userQuests.count) ?? 0;
  const completedQuests = useQuery(api.userQuests.countCompleted) ?? 0;
  const questsByCategory = useQuery(api.userQuests.getByCategory);
  const placeholders = useQuery(api.userQuestPlaceholders.getActive);
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

  const createUnifiedList = () => {
    const unifiedItems: Array<{
      type: "placeholder" | "quest";
      category: Category;
      data: any;
      slug?: string;
      isCorePlaceholder?: boolean;
    }> = [];

    if (placeholders) {
      for (const placeholder of placeholders) {
        const category = placeholder.category as Category;

        unifiedItems.push({
          type: "placeholder",
          category,
          data: placeholder,
          isCorePlaceholder: true,
        });
      }
    }

    // Add quests
    if (questsByCategory) {
      for (const [category, quests] of Object.entries(questsByCategory)) {
        for (const quest of quests) {
          unifiedItems.push({
            type: "quest",
            category: category as Category,
            data: quest,
            slug: quest.slug,
          });
        }
      }
    }

    return unifiedItems;
  };

  const unifiedItems = createUnifiedList();

  // Separate core and non-core items based on isCore property
  const coreItems = unifiedItems.filter(
    (item) => CATEGORIES[item.category]?.isCore,
  );
  const nonCoreItems = unifiedItems.filter(
    (item) => !CATEGORIES[item.category]?.isCore,
  );

  // Group non-core items by category
  const groupedNonCoreItems = nonCoreItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<Category, typeof nonCoreItems>,
  );

  // Create ordered non-core categories
  const orderedNonCoreCategories: Category[] = Object.keys(groupedNonCoreItems)
    .filter((cat) => groupedNonCoreItems[cat as Category]?.length > 0)
    .sort((a, b) => {
      const aInfo = CATEGORIES[a as Category];
      const bInfo = CATEGORIES[b as Category];
      return aInfo.label.localeCompare(bInfo.label);
    }) as Category[];

  // Get core categories in their defined order from CATEGORIES
  const coreCategoriesOrder: Category[] = Object.keys(CATEGORIES).filter(
    (cat) => CATEGORIES[cat as Category]?.isCore,
  ) as Category[];

  const sortedCoreItems = coreItems.sort((a, b) => {
    const aIndex = coreCategoriesOrder.indexOf(a.category);
    const bIndex = coreCategoriesOrder.indexOf(b.category);
    return aIndex - bIndex;
  });

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
        {/* Core Documents section */}
        {sortedCoreItems.length > 0 && (
          <NavGroup
            key="core-documents"
            label="Core Documents"
            icon={CATEGORIES.courtOrder.icon}
          >
            {sortedCoreItems.map((item) => {
              const category = item.category;
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
                      onChange={(status) =>
                        handleStatusChange(quest.questId, status)
                      }
                      onRemove={() => handleRemoveQuest(quest.questId)}
                      condensed
                    />
                  }
                >
                  {quest.title}
                  {quest.jurisdiction && (
                    <Badge size="xs">{quest.jurisdiction}</Badge>
                  )}
                </NavItem>
              );
            })}
          </NavGroup>
        )}

        {/* Non-core quest categories */}
        {orderedNonCoreCategories.map((category) => {
          const items = groupedNonCoreItems[category];
          if (!items || items.length === 0) return null;

          const categoryInfo = CATEGORIES[category];

          return (
            <NavGroup
              key={category}
              label={categoryInfo.label}
              icon={categoryInfo.icon}
            >
              {items.map((item) => {
                const quest = item.data;
                return (
                  <NavItem
                    key={quest._id}
                    href={{
                      to: "/quests/$questSlug",
                      params: { questSlug: quest.slug },
                    }}
                    size="large"
                    icon={CATEGORIES[quest.category as Category]?.icon}
                    actions={
                      <StatusSelect
                        status={quest.status as Status}
                        onChange={(status) =>
                          handleStatusChange(quest.questId, status)
                        }
                        onRemove={() => handleRemoveQuest(quest.questId)}
                        condensed
                      />
                    }
                  >
                    {quest.title}
                    {quest.jurisdiction && (
                      <Badge size="xs">{quest.jurisdiction}</Badge>
                    )}
                  </NavItem>
                );
              })}
            </NavGroup>
          );
        })}
      </Nav>
    </div>
  );
};
