import {
  Badge,
  Button,
  Container,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Empty,
  GridList,
  GridListItem,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  ProgressBar,
  Tooltip,
  TooltipTrigger,
} from "@/components";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { api } from "@convex/_generated/api";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  type Category,
  DATE_ADDED,
  DATE_ADDED_ORDER,
  type DateAdded,
  type GroupDetails,
  type GroupQuestsBy,
  STATUS,
  STATUS_ORDER,
  type Status,
  TIME_UNITS,
  TIME_UNITS_ORDER,
  type TimeUnit,
} from "@convex/constants";
import { RiListCheck2, RiSignpostLine } from "@remixicon/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import type { Selection } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export const Route = createFileRoute("/_authenticated/_home")({
  component: IndexRoute,
});

function sortGroupedQuests(
  groupA: string,
  groupB: string,
  groupByValue: GroupQuestsBy,
): number {
  switch (groupByValue) {
    case "category": {
      const indexA = CATEGORY_ORDER.indexOf(groupA as Category);
      const indexB = CATEGORY_ORDER.indexOf(groupB as Category);
      return indexA - indexB;
    }
    case "status": {
      const indexA = STATUS_ORDER.indexOf(groupA as Status);
      const indexB = STATUS_ORDER.indexOf(groupB as Status);
      return indexA - indexB;
    }
    case "dateAdded": {
      const indexA = DATE_ADDED_ORDER.indexOf(groupA as DateAdded);
      const indexB = DATE_ADDED_ORDER.indexOf(groupB as DateAdded);
      return indexA - indexB;
    }
    case "timeRequired": {
      const indexA = TIME_UNITS_ORDER.indexOf(groupA as TimeUnit);
      const indexB = TIME_UNITS_ORDER.indexOf(groupB as TimeUnit);
      return indexA - indexB;
    }
  }
}

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
    const questsByTimeRequired = useQuery(
      api.userQuests.getUserQuestsByTimeRequired,
    );

    const groupedQuests = {
      category: questsByCategory,
      dateAdded: questsByDate,
      status: questsByStatus,
      timeRequired: questsByTimeRequired,
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
      ...Object.values(STATUS).map((status) => status.label),
      ...Object.values(DATE_ADDED).map((date) => date.label),
      ...Object.values(TIME_UNITS).map((timeUnit) => timeUnit.label),
    ];

    return (
      <AppSidebar>
        <div className="flex items-center mb-4 bg-gray-app z-10">
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
                  <MenuItem id="status">Status</MenuItem>
                  <MenuItem id="dateAdded">Date added</MenuItem>
                  <MenuItem id="timeRequired">Time required</MenuItem>
                </MenuSection>
              </Menu>
            </MenuTrigger>
            <Tooltip placement="right">Group by</Tooltip>
          </TooltipTrigger>
        </div>
        <DisclosureGroup
          allowsMultipleExpanded
          defaultExpandedKeys={[...allCategoryKeys]}
          className="-ml-2"
        >
          {Object.entries(groupedQuests)
            .sort(([groupA], [groupB]) =>
              sortGroupedQuests(groupA, groupB, groupByValue),
            )
            .map(([group, quests]) => {
              if (quests.length === 0) return null;
              let groupDetails: GroupDetails;
              switch (groupByValue) {
                case "category":
                  groupDetails = CATEGORIES[group as keyof typeof CATEGORIES];
                  break;
                case "status":
                  groupDetails = STATUS[group as keyof typeof STATUS];
                  break;
                case "timeRequired":
                  groupDetails = TIME_UNITS[group as keyof typeof TIME_UNITS];
                  break;
                case "dateAdded":
                  groupDetails = DATE_ADDED[group as keyof typeof DATE_ADDED];
                  break;
              }
              const { label, icon: Icon } = groupDetails;

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
      </AppSidebar>
    );
  };

  return (
    <>
      <Authenticated>
        <Container className="flex gap-6">
          <MyQuests />
          <Outlet />
        </Container>
      </Authenticated>
      <Unauthenticated>
        <h1>Please log in</h1>
      </Unauthenticated>
    </>
  );
}
