import { AppSidebar } from "@/components/app";
import {
  Badge,
  Container,
  Nav,
  NavGroup,
  NavItem,
  ProgressBar,
} from "@/components/common";
import { StatusBadge } from "@/components/quests";
import { api } from "@convex/_generated/api";
import { CATEGORIES, CORE_QUESTS, type Status } from "@convex/constants";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_authenticated/_home")({
  component: IndexRoute,
});

function IndexRoute() {
  const MyQuests = () => {
    const coreQuestCount = useQuery(api.userCoreQuests.count) ?? 0;
    const userQuestCount = useQuery(api.userQuests.count) ?? 0;
    const totalCount = coreQuestCount + userQuestCount;

    const completedCoreQuests =
      useQuery(api.userCoreQuests.countCompleted) ?? 0;
    const completedQuests = useQuery(api.userQuests.countCompleted) ?? 0;
    const completedTotal = completedCoreQuests + completedQuests;

    const questsByCategory = useQuery(api.userQuests.getByCategory);

    return (
      <AppSidebar>
        <div className="flex items-center mb-4">
          <ProgressBar
            label="Quest progress"
            value={completedTotal}
            maxValue={totalCount}
            valueLabel={
              <span className="text-gray-normal">
                <span className="text-gray-normal text-base font-medium mr-0.5 leading-none">
                  {completedTotal}
                </span>{" "}
                <span className="text-gray-8 dark:text-graydark-8">/</span>{" "}
                <span className="text-gray-dim">{totalCount} complete</span>
              </span>
            }
            labelHidden
          />
        </div>
        <Nav>
          <NavItem
            href={{ to: "/court-order" }}
            icon={CORE_QUESTS["court-order"].icon}
            size="large"
          >
            Court Order
          </NavItem>
          <NavItem
            href={{ to: "/state-id" }}
            icon={CORE_QUESTS["state-id"].icon}
            size="large"
          >
            State ID
          </NavItem>
          <NavItem
            href={{ to: "/social-security" }}
            icon={CORE_QUESTS["social-security"].icon}
            size="large"
          >
            Social Security
          </NavItem>
          <NavItem
            href={{ to: "/passport" }}
            icon={CORE_QUESTS.passport.icon}
            size="large"
          >
            Passport
          </NavItem>
          <NavItem
            href={{ to: "/birth-certificate" }}
            icon={CORE_QUESTS["birth-certificate"].icon}
            size="large"
          >
            Birth Certificate
          </NavItem>
          {questsByCategory &&
            Object.keys(questsByCategory).length > 0 &&
            Object.entries(questsByCategory).map(([group, quests]) => {
              if (quests.length === 0) return null;
              const { label } = CATEGORIES[group as keyof typeof CATEGORIES];

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
                      <StatusBadge status={quest.status as Status} condensed />
                      {quest.title}
                      {quest.jurisdiction && (
                        <Badge size="xs">{quest.jurisdiction}</Badge>
                      )}
                    </NavItem>
                  ))}
                </NavGroup>
              );
            })}
        </Nav>
      </AppSidebar>
    );
  };

  return (
    <Container className="flex">
      <MyQuests />
      <Outlet />
    </Container>
  );
}
