import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { ListFilter, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Badge,
  BadgeButton,
  Button,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Nav,
  NavGroup,
  NavItem,
  SearchField,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { StatusSelect } from "@/components/quests";
import {
  CATEGORIES,
  type Category,
  JURISDICTIONS,
  type Status,
} from "@/constants";
import { useQuestsSidebar } from "./QuestsSidebarProvider";

export const AllQuestsNavItem = ({
  quest,
  categoryFilter,
}: {
  quest: Doc<"quests">;
  categoryFilter?: Category;
}) => {
  const navigate = useNavigate();
  const userQuest = useQuery(api.userQuests.getByQuestId, {
    questId: quest._id,
  });
  const addQuest = useMutation(api.userQuests.create);
  const removeQuest = useMutation(api.userQuests.deleteForever);
  const updateStatus = useMutation(api.userQuests.setStatus);
  const { setActiveTab } = useQuestsSidebar();

  const handleAddQuest = async () => {
    try {
      await addQuest({ questId: quest._id });
      navigate({ to: "/quests/$questSlug", params: { questSlug: quest.slug } });
      setActiveTab("user");
    } catch (_err) {
      toast.error("Failed to add quest. Please try again.");
    }
  };

  const handleRemoveQuest = async () => {
    try {
      await removeQuest({ questId: quest._id });
      toast.success("Removed from your quests");
    } catch (_err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleStatusChange = async (status: Status) => {
    try {
      await updateStatus({ questId: quest._id, status });
    } catch (_err) {
      toast.error("Couldn't update status. Please try again.");
    }
  };

  // Check if we should show jurisdiction instead of title
  const shouldShowJurisdiction =
    categoryFilter &&
    ["courtOrder", "birthCertificate", "stateId"].includes(categoryFilter) &&
    quest.jurisdiction;

  const displayText =
    shouldShowJurisdiction && quest.jurisdiction
      ? JURISDICTIONS[quest.jurisdiction]
      : quest.title;

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
            <Tooltip placement="right">Add to my quests</Tooltip>
          </TooltipTrigger>
        )
      }
    >
      {displayText}
      {quest.jurisdiction && !shouldShowJurisdiction && (
        <Badge size="xs">{quest.jurisdiction}</Badge>
      )}
    </NavItem>
  );
};

export const AllQuests = () => {
  const { categoryFilter, setCategoryFilter } = useQuestsSidebar();
  const [search, setSearch] = useState("");
  const activeQuests = useQuery(api.quests.getRelevantActive);

  // Filter quests by search term and category
  const filteredQuests = activeQuests?.filter((quest) => {
    const matchesSearch =
      quest.title.toLowerCase().includes(search.toLowerCase()) ||
      quest.jurisdiction?.toLowerCase().includes(search.toLowerCase()) ||
      (quest.jurisdiction &&
        JURISDICTIONS[quest.jurisdiction]
          ?.toLowerCase()
          .includes(search.toLowerCase()));
    const matchesCategory =
      !categoryFilter || quest.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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

  // Get all available categories from active quests
  const availableCategories = activeQuests
    ? Array.from(
        new Set(activeQuests.map((quest) => quest.category as Category)),
      )
    : [];

  const handleCategorySelect = (category: Category | undefined) => {
    setCategoryFilter(category);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 -mx-2">
        <div className="flex gap-2">
          <SearchField
            placeholder={
              categoryFilter
                ? `Search ${CATEGORIES[categoryFilter]?.label} quests`
                : "Search all quests"
            }
            aria-label="Search"
            value={search}
            onChange={setSearch}
            autoFocus
            className="flex-1"
          />
          <MenuTrigger>
            <TooltipTrigger>
              <Button variant="icon" icon={ListFilter} />
              <Tooltip placement="right">Filter</Tooltip>
            </TooltipTrigger>
            <Menu placement="bottom end">
              <MenuSection
                title="Category"
                selectionMode="single"
                selectedKeys={
                  categoryFilter ? new Set([categoryFilter]) : new Set()
                }
                disallowEmptySelection={false}
                onSelectionChange={(selection) => {
                  const selectedCategory = [...selection][0] as
                    | Category
                    | undefined;
                  handleCategorySelect(selectedCategory);
                }}
              >
                {availableCategories
                  .sort((a, b) =>
                    CATEGORIES[a].label.localeCompare(CATEGORIES[b].label),
                  )
                  .map((category) => (
                    <MenuItem
                      key={category}
                      id={category}
                      icon={CATEGORIES[category].icon}
                    >
                      {CATEGORIES[category].label}
                    </MenuItem>
                  ))}
              </MenuSection>
            </Menu>
          </MenuTrigger>
        </div>

        {/* Active filter display */}
        {categoryFilter && (
          <Badge size="lg" icon={CATEGORIES[categoryFilter].icon}>
            {CATEGORIES[categoryFilter].label}
            <BadgeButton
              icon={X}
              label="Clear filter"
              onPress={() => setCategoryFilter(undefined)}
            />
          </Badge>
        )}
      </div>
      <Nav>
        {questsByCategory &&
          Object.entries(questsByCategory).map(([category, quests]) => {
            if (quests.length === 0) return null;
            const categoryInfo = CATEGORIES[category as Category];
            if (!categoryInfo) return null;

            return (
              <NavGroup key={category} label={categoryInfo.label}>
                {quests.map((quest) => (
                  <AllQuestsNavItem
                    key={quest._id}
                    quest={quest}
                    categoryFilter={categoryFilter}
                  />
                ))}
              </NavGroup>
            );
          })}
      </Nav>
    </div>
  );
};
