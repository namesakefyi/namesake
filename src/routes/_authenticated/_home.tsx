import { AppSidebar } from "@/components/app";
import {
  Badge,
  Nav,
  NavGroup,
  NavItem,
  ProgressBar,
} from "@/components/common";
import { StatusBadge } from "@/components/quests";
import { api } from "@convex/_generated/api";
import {
  CATEGORIES,
  type Category,
  type CoreCategory,
  type Status,
} from "@convex/constants";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_home")({
  component: IndexRoute,
});

function IndexRoute() {
  const MyQuests = () => {
    const user = useQuery(api.users.getCurrent);
    const userQuests = useQuery(api.userQuests.count) ?? 0;
    const completedQuests = useQuery(api.userQuests.countCompleted) ?? 0;
    const questsByCategory = useQuery(api.userQuests.getByCategory);

    const CORE_CATEGORIES: Record<
      CoreCategory,
      { to: string; label: string; icon: LucideIcon }
    > = {
      courtOrder: {
        to: "court-order",
        label: CATEGORIES.courtOrder.label,
        icon: CATEGORIES.courtOrder.icon,
      },
      socialSecurity: {
        to: "social-security",
        label: CATEGORIES.socialSecurity.label,
        icon: CATEGORIES.socialSecurity.icon,
      },
      stateId: {
        to: "state-id",
        label: CATEGORIES.stateId.label,
        icon: CATEGORIES.stateId.icon,
      },
      passport: {
        to: "passport",
        label: CATEGORIES.passport.label,
        icon: CATEGORIES.passport.icon,
      },
      birthCertificate: {
        to: "birth-certificate",
        label: CATEGORIES.birthCertificate.label,
        icon: CATEGORIES.birthCertificate.icon,
      },
    } as const;

    return (
      <AppSidebar>
        {userQuests > 0 && (
          <div className="flex items-center mb-4">
            <ProgressBar
              label="Quest progress"
              value={completedQuests}
              maxValue={userQuests}
              valueLabel={
                <span className="text-gray-normal">
                  <span className="text-gray-normal text-base font-medium mr-0.5 leading-none">
                    {completedQuests}
                  </span>{" "}
                  <span className="text-gray-8">/</span>{" "}
                  <span className="text-gray-dim">{userQuests} complete</span>
                </span>
              }
              labelHidden
            />
          </div>
        )}
        <Nav>
          {(Object.keys(CORE_CATEGORIES) as CoreCategory[]).map((category) => {
            const userQuest = questsByCategory?.[category]?.[0];
            const config = CORE_CATEGORIES[category];

            if (
              category === "birthCertificate" &&
              user?.birthplace === "other"
            ) {
              return null;
            }

            if (userQuest) {
              return (
                <NavItem
                  key={userQuest._id}
                  href={{
                    to: "/$questSlug",
                    params: { questSlug: userQuest.slug },
                  }}
                  icon={config.icon}
                  size="large"
                >
                  {userQuest.title}
                  {userQuest.jurisdiction && (
                    <Badge size="xs">{userQuest.jurisdiction}</Badge>
                  )}
                  <StatusBadge
                    status={userQuest.status as Status}
                    condensed
                    className="ml-auto mr-1"
                  />
                </NavItem>
              );
            }

            return (
              <NavItem
                key={category}
                href={{ to: "/$questSlug", params: { questSlug: config.to } }}
                icon={config.icon}
                size="large"
                className="border border-dashed border-gray-dim"
              >
                {config.label}
              </NavItem>
            );
          })}

          {questsByCategory &&
            Object.entries(questsByCategory).map(([group, quests]) => {
              if (quests.length === 0 || group in CORE_CATEGORIES) return null;

              const { label } = CATEGORIES[group as keyof typeof CATEGORIES];

              return (
                <NavGroup key={label} label={label}>
                  {quests.map((quest) => (
                    <NavItem
                      key={quest._id}
                      href={{
                        to: "/$questSlug",
                        params: { questSlug: quest.slug },
                      }}
                      size="large"
                      icon={CATEGORIES[quest.category as Category].icon}
                    >
                      {quest.title}
                      {quest.jurisdiction && (
                        <Badge size="xs">{quest.jurisdiction}</Badge>
                      )}
                      <StatusBadge
                        status={quest.status as Status}
                        condensed
                        className="ml-auto mr-1"
                      />
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
    <div className="flex">
      <MyQuests />
      <Outlet />
    </div>
  );
}
