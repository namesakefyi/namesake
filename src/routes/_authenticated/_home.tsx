import {
  Badge,
  Button,
  Empty,
  GridList,
  GridListItem,
  Link,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  ProgressBar,
  Tooltip,
  TooltipTrigger,
} from "@/components";
import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
} from "@/components/Disclosure";
import { api } from "@convex/_generated/api";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  DATE_ADDED,
  DATE_ADDED_ORDER,
  type GroupQuestsBy,
  STATUS,
  STATUS_ORDER,
} from "@convex/constants";
import { RiAddLine, RiListCheck2, RiSignpostLine } from "@remixicon/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import type { Selection } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export const Route = createFileRoute("/_authenticated/_home")({
  component: IndexRoute,
});

function IndexRoute() {
  const [groupBy, setGroupBy] = useState<Selection>(
    new Set([localStorage.getItem("groupQuestsBy") ?? "category"]),
  );

  useEffect(() => {
    const selected = ([...groupBy][0] as GroupQuestsBy) ?? "category";
    localStorage.setItem("groupQuestsBy", selected);
  }, [groupBy]);

  const MyQuests = () => {
    const userQuestCount = useQuery(api.userQuests.getUserQuestCount);
    const completedQuests = useQuery(api.userQuests.getCompletedQuestCount);

    // Get the selected grouping method
    const groupByValue = ([...groupBy][0] as GroupQuestsBy) ?? "category";

    // Use the appropriate query based on grouping selection
    const questsByCategory = useQuery(api.userQuests.getUserQuestsByCategory);
    const questsByDate = useQuery(api.userQuests.getUserQuestsByDate);
    const questsByStatus = useQuery(api.userQuests.getUserQuestsByStatus);

    const groupedQuests = {
      category: questsByCategory,
      dateAdded: questsByDate,
      status: questsByStatus,
    }[groupByValue];

    if (groupedQuests === undefined) return;

    if (groupedQuests === null || Object.keys(groupedQuests).length === 0)
      return (
        <Empty
          title="No quests"
          icon={RiSignpostLine}
          link={{
            children: "Add quest",
            button: {
              variant: "primary",
            },
            href: { to: "/browse" },
          }}
        />
      );

    const allCategoryKeys = [
      ...Object.values(CATEGORIES).map((category) => category.label),
      ...Object.values(DATE_ADDED).map((date) => date.label),
      ...Object.values(STATUS).map((status) => status.label),
    ];

    return (
      <div className="flex flex-col w-80 border-r border-gray-dim">
        <div className="flex items-center py-3 px-4 h-16 border-b border-gray-dim">
          <ProgressBar
            label="Quests complete"
            value={completedQuests}
            maxValue={userQuestCount}
            valueLabel={`${completedQuests} of ${userQuestCount}`}
            className="mr-4"
          />
          <TooltipTrigger>
            <MenuTrigger>
              <Button icon={RiListCheck2} variant="icon" />
              <Menu
                selectionMode="single"
                selectedKeys={groupBy}
                onSelectionChange={setGroupBy}
                disallowEmptySelection
              >
                <MenuSection title="Group by">
                  <MenuItem id="category">Category</MenuItem>
                  <MenuItem id="dateAdded">Date added</MenuItem>
                  <MenuItem id="status">Status</MenuItem>
                </MenuSection>
              </Menu>
            </MenuTrigger>
            <Tooltip>Group by</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <Link
              aria-label="Add quest"
              href={{ to: "/browse" }}
              button={{ variant: "icon", className: "-mr-1" }}
            >
              <RiAddLine size={20} />
            </Link>
            <Tooltip>Add quests</Tooltip>
          </TooltipTrigger>
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
          <DisclosureGroup
            allowsMultipleExpanded
            defaultExpandedKeys={[...allCategoryKeys]}
          >
            {Object.entries(groupedQuests)
              .sort(([groupA], [groupB]) => {
                const orderArray =
                  groupByValue === "category"
                    ? CATEGORY_ORDER
                    : groupByValue === "status"
                      ? STATUS_ORDER
                      : DATE_ADDED_ORDER;

                return (
                  orderArray.indexOf(groupA as any) -
                  orderArray.indexOf(groupB as any)
                );
              })
              .map(([group, quests]) => {
                if (quests.length === 0) return null;
                const { label, icon: Icon } =
                  groupByValue === "category"
                    ? CATEGORIES[group as keyof typeof CATEGORIES]
                    : groupByValue === "status"
                      ? STATUS[group as keyof typeof STATUS]
                      : DATE_ADDED[group as keyof typeof DATE_ADDED];

                return (
                  <Disclosure
                    defaultExpanded
                    key={label}
                    id={label}
                    title={
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="text-gray-dim" />
                        {label}
                        <Badge className="ml-auto">{quests.length}</Badge>
                      </div>
                    }
                  >
                    <DisclosurePanel>
                      <GridList
                        aria-label={`${group} quests`}
                        className="border-none"
                      >
                        {quests.map((quest) => (
                          <GridListItem
                            textValue={quest.title}
                            key={quest._id}
                            href={{
                              to: "/quests/$questId",
                              params: { questId: quest.questId },
                            }}
                            className="hover:bg-gray-3 dark:hover:bg-graydark-3 rounded-md pl-8 h-8"
                          >
                            <div className="flex items-center justify-between gap-2 w-full">
                              <div
                                className={twMerge(
                                  quest.completionTime && "opacity-40",
                                )}
                              >
                                {quest.title}
                              </div>
                            </div>
                          </GridListItem>
                        ))}
                      </GridList>
                    </DisclosurePanel>
                  </Disclosure>
                );
              })}
          </DisclosureGroup>
        </div>
      </div>
    );
  };

  return (
    <>
      <Authenticated>
        <div className="flex flex-1 min-h-0">
          <MyQuests />
          <Outlet />
        </div>
      </Authenticated>
      <Unauthenticated>
        <h1>Please log in</h1>
      </Unauthenticated>
    </>
  );
}
