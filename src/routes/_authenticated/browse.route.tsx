import { AppSidebar } from "@/components/app";
import { AddOrGoToQuestButton } from "@/components/browse";
import {
  Badge,
  Container,
  Empty,
  Nav,
  NavGroup,
  NavItem,
  SearchField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { CATEGORIES, type Category } from "@convex/constants";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Milestone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/browse")({
  component: IndexRoute,
});

const QuestNavItem = ({ quest }: { quest: Doc<"quests"> }) => {
  return (
    <NavItem
      key={quest._id}
      href={{
        to: "/browse/$questId",
        params: { questId: quest._id },
      }}
    >
      {quest.title}
      {quest.jurisdiction && <Badge size="xs">{quest.jurisdiction}</Badge>}
      <AddOrGoToQuestButton
        quest={quest}
        size="small"
        className="ml-auto h-6 py-0"
      />
    </NavItem>
  );
};

function IndexRoute() {
  const [search, setSearch] = useState("");
  const quests = useQuery(api.quests.getAllActive);
  const questCount = useQuery(api.quests.count);

  const filteredQuests = quests?.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()),
  );

  // Group quests by category
  const groupedQuests = filteredQuests?.reduce(
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

  const placeholder = `Search all ${questCount && questCount > 1 ? `${questCount} quests` : "quests"}`;

  return (
    <Container className="flex">
      <AppSidebar>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder={placeholder}
          aria-label="Search quests"
          className="mb-4"
        />
        <Nav>
          {filteredQuests?.length === 0 ? (
            <Empty
              title="No quests found"
              icon={Milestone}
              subtitle="Update your search terms or filters."
            />
          ) : (
            Object.entries(CATEGORIES).map(([categoryKey, { label, icon }]) => {
              const categoryQuests =
                groupedQuests?.[categoryKey as Category] || [];

              if (categoryQuests.length === 0) return null;

              return (
                <NavGroup
                  key={categoryKey}
                  label={label}
                  icon={icon}
                  count={categoryQuests.length}
                >
                  {categoryQuests.map((quest) => (
                    <QuestNavItem key={quest._id} quest={quest} />
                  ))}
                </NavGroup>
              );
            })
          )}
        </Nav>
      </AppSidebar>
      <Outlet />
    </Container>
  );
}
