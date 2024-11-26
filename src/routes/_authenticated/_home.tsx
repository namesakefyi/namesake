import {
  Badge,
  Button,
  Container,
  Empty,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Nav,
  NavGroup,
  NavItem,
  ProgressBar,
  StatusBadge,
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
} from "@convex/constants";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { LayoutList, Milestone } from "lucide-react";
import { useEffect, useState } from "react";
import type { Selection } from "react-aria-components";

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

    const groupedQuests = {
      category: questsByCategory,
      dateAdded: questsByDate,
      status: questsByStatus,
    }[groupByValue];

    if (groupedQuests === undefined) return;

    return (
      <AppSidebar>
        <div className="flex items-center mb-4 bg-gray-app z-10">
          <ProgressBar
            label="Quest progress"
            value={completedQuests}
            maxValue={userQuestCount}
            valueLabel={
              <span className="text-gray-normal">
                <span className="text-gray-normal text-base font-medium mr-0.5 leading-none">
                  {completedQuests}
                </span>{" "}
                <span className="text-gray-8 dark:text-graydark-8">/</span>{" "}
                <span className="text-gray-dim">
                  {userQuestCount} quests complete
                </span>
              </span>
            }
            labelHidden
            className="mr-4"
          />
          <TooltipTrigger>
            <MenuTrigger>
              <Button icon={LayoutList} variant="icon" />
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
                </MenuSection>
              </Menu>
            </MenuTrigger>
            <Tooltip placement="right">Group by</Tooltip>
          </TooltipTrigger>
        </div>
        <Nav>
          {Object.keys(groupedQuests).length === 0 ? (
            <Empty
              title="No quests"
              icon={Milestone}
              link={{
                children: "Add quest",
                button: {
                  variant: "primary",
                },
                href: { to: "/browse" },
              }}
            />
          ) : (
            Object.entries(groupedQuests)
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
                  case "dateAdded":
                    groupDetails = DATE_ADDED[group as keyof typeof DATE_ADDED];
                    break;
                }
                const { label } = groupDetails;

                return (
                  <NavGroup key={label} label={label} count={quests.length}>
                    {quests.map((quest) => (
                      <NavItem
                        key={quest._id}
                        href={{
                          to: "/quests/$questId",
                          params: { questId: quest.questId },
                        }}
                      >
                        <StatusBadge
                          status={quest.status as Status}
                          condensed
                        />
                        {quest.title}
                        {quest.jurisdiction && (
                          <Badge size="xs">{quest.jurisdiction}</Badge>
                        )}
                      </NavItem>
                    ))}
                  </NavGroup>
                );
              })
          )}
        </Nav>
      </AppSidebar>
    );
  };

  return (
    <>
      <Authenticated>
        <Container className="flex">
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
