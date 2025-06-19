import {
  AppNav,
  AppSidebarContent,
  AppSidebarFooter,
  NamesakeHeader,
} from "@/components/app";
import { AppSidebar } from "@/components/app";
import { AppSidebarHeader } from "@/components/app";
import {
  Badge,
  Button,
  Nav,
  NavGroup,
  NavItem,
  ProgressBar,
  SearchField,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { StatusSelect } from "@/components/quests";
import {
  CATEGORIES,
  type Category,
  type CoreCategory,
  type Status,
} from "@/constants";
import { useIsMobile } from "@/hooks/useIsMobile";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MyQuests = () => {
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

  const handleDismissPlaceholder = async (category: CoreCategory) => {
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

  const handleRestorePlaceholder = async (category: CoreCategory) => {
    await restorePlaceholder({ category });
  };

  const hasQuests = userQuests > 0;

  const createUnifiedList = () => {
    const unifiedItems: Array<{
      type: "placeholder" | "quest";
      category: Category;
      data: any;
      slug: string;
      isCorePlaceholder?: boolean;
    }> = [];

    if (placeholders) {
      for (const placeholder of placeholders) {
        const category = placeholder.category as CoreCategory;

        unifiedItems.push({
          type: "placeholder",
          category,
          data: placeholder,
          slug:
            category === "courtOrder"
              ? "court-order"
              : category === "socialSecurity"
                ? "social-security"
                : category === "stateId"
                  ? "state-id"
                  : category === "passport"
                    ? "passport"
                    : "birth-certificate",
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

  const corePlaceholders = unifiedItems.filter(
    (item) => item.isCorePlaceholder,
  );
  const otherItems = unifiedItems.filter((item) => !item.isCorePlaceholder);

  // Group non-placeholder items by category
  const groupedItems = otherItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<Category, typeof otherItems>,
  );

  // Create ordered categories: core categories first, then non-core
  const orderedCategories: Category[] = [
    ...(
      [
        "courtOrder",
        "socialSecurity",
        "stateId",
        "passport",
        "birthCertificate",
      ] as CoreCategory[]
    ).filter((cat) => groupedItems[cat]?.length > 0),
    ...(Object.keys(groupedItems)
      .filter(
        (cat) =>
          ![
            "courtOrder",
            "socialSecurity",
            "stateId",
            "passport",
            "birthCertificate",
          ].includes(cat as CoreCategory),
      )
      .sort((a, b) => {
        const aInfo = CATEGORIES[a as Category];
        const bInfo = CATEGORIES[b as Category];
        return aInfo.label.localeCompare(bInfo.label);
      }) as Category[]),
  ];

  return (
    <div className="flex flex-col gap-4">
      {hasQuests && (
        <div className="flex items-end bg-theme-3 rounded-lg p-2 -mx-2 h-12">
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
        {/* Core Documents section with placeholders */}
        {corePlaceholders.length > 0 && (
          <NavGroup
            key="core-documents"
            label="Core Documents"
            icon={CATEGORIES.courtOrder.icon}
          >
            {corePlaceholders
              .sort((a, b) => {
                const aIndex = [
                  "courtOrder",
                  "socialSecurity",
                  "stateId",
                  "passport",
                  "birthCertificate",
                ].indexOf(a.category as CoreCategory);
                const bIndex = [
                  "courtOrder",
                  "socialSecurity",
                  "stateId",
                  "passport",
                  "birthCertificate",
                ].indexOf(b.category as CoreCategory);
                return aIndex - bIndex;
              })
              .map((item) => {
                const category = item.category as CoreCategory;
                const categoryInfo = CATEGORIES[category];

                return (
                  <NavItem
                    key={`placeholder-${item.category}`}
                    href={{
                      to: "/quests/$questSlug",
                      params: { questSlug: item.slug },
                    }}
                    icon={categoryInfo.icon}
                    size="large"
                    className="border border-dashed border-dim"
                    actions={
                      <TooltipTrigger>
                        <Button
                          variant="icon"
                          size="small"
                          icon={X}
                          onPress={() => handleDismissPlaceholder(category)}
                        />
                        <Tooltip>Dismiss suggestion</Tooltip>
                      </TooltipTrigger>
                    }
                  >
                    {categoryInfo.label}
                  </NavItem>
                );
              })}
          </NavGroup>
        )}

        {/* Regular quest categories */}
        {orderedCategories.map((category) => {
          const items = groupedItems[category];
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

const AllQuestsNavItem = ({ quest }: { quest: Doc<"quests"> }) => {
  const userQuest = useQuery(api.userQuests.getByQuestId, {
    questId: quest._id,
  });
  const addQuest = useMutation(api.userQuests.create);
  const removeQuest = useMutation(api.userQuests.deleteForever);
  const updateStatus = useMutation(api.userQuests.setStatus);

  const handleAddQuest = async () => {
    try {
      await addQuest({ questId: quest._id });
      toast.success("Added to your quests");
    } catch (err) {
      toast.error("Failed to add quest. Please try again.");
    }
  };

  const handleRemoveQuest = async () => {
    try {
      await removeQuest({ questId: quest._id });
      toast.success("Removed from your quests");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleStatusChange = async (status: Status) => {
    try {
      await updateStatus({ questId: quest._id, status });
    } catch (err) {
      toast.error("Couldn't update status. Please try again.");
    }
  };

  return (
    <NavItem
      key={quest._id}
      href={{
        to: "/quests/$questSlug",
        params: { questSlug: quest.slug },
      }}
      actions={
        userQuest ? (
          <StatusSelect
            status={userQuest.status as Status}
            onChange={handleStatusChange}
            onRemove={handleRemoveQuest}
            condensed
          />
        ) : (
          <TooltipTrigger>
            <Button
              variant="icon"
              size="small"
              icon={Plus}
              onPress={handleAddQuest}
            />
            <Tooltip>Add to my quests</Tooltip>
          </TooltipTrigger>
        )
      }
    >
      {quest.title}
      {quest.jurisdiction && <Badge size="xs">{quest.jurisdiction}</Badge>}
    </NavItem>
  );
};

const AllQuests = () => {
  const [search, setSearch] = useState("");
  const activeQuests = useQuery(api.quests.getAllActive);
  const filteredQuests = activeQuests?.filter((quest) =>
    quest.title.toLowerCase().includes(search.toLowerCase()),
  );

  // Group quests by category
  const questsByCategory = filteredQuests?.reduce<
    Record<Category, Doc<"quests">[]>
  >(
    (acc, quest) => {
      const category = quest.category as Category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(quest);
      return acc;
    },
    {} as Record<Category, Doc<"quests">[]>,
  );

  return (
    <div className="flex flex-col gap-4">
      <SearchField
        placeholder="Search all quests"
        aria-label="Search"
        value={search}
        onChange={setSearch}
        autoFocus
      />
      <Nav>
        {questsByCategory &&
          Object.entries(questsByCategory).map(([category, quests]) => {
            if (quests.length === 0) return null;
            const categoryInfo = CATEGORIES[category as Category];
            if (!categoryInfo) return null;

            return (
              <NavGroup
                key={category}
                label={categoryInfo.label}
                icon={categoryInfo.icon}
              >
                {quests.map((quest) => (
                  <AllQuestsNavItem key={quest._id} quest={quest} />
                ))}
              </NavGroup>
            );
          })}
      </Nav>
    </div>
  );
};

export const QuestsSidebar = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"user" | "all">("user");

  return (
    <AppSidebar>
      <AppSidebarHeader>
        <NamesakeHeader onLogoPress={() => setActiveTab("user")}>
          <TooltipTrigger>
            <Button
              aria-label={
                activeTab === "user" ? "Browse all quests" : "Back to my quests"
              }
              variant="icon"
              onPress={() =>
                setActiveTab(activeTab === "user" ? "all" : "user")
              }
              icon={activeTab === "user" ? Search : X}
              className="ml-auto -mr-2"
            />
            <Tooltip placement="left">
              {activeTab === "user" ? "Browse all quests" : "Back to my quests"}
            </Tooltip>
          </TooltipTrigger>
        </NamesakeHeader>
      </AppSidebarHeader>
      <AppSidebarContent>
        {activeTab === "user" ? <MyQuests /> : <AllQuests />}
      </AppSidebarContent>
      {!isMobile && (
        <AppSidebarFooter>
          <AppNav />
        </AppSidebarFooter>
      )}
    </AppSidebar>
  );
};
