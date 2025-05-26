import {
  Badge,
  Button,
  Nav,
  NavGroup,
  NavItem,
  ProgressBar,
  SearchField,
  Tab,
  TabList,
  TabPanel,
  Tabs,
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
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { type LucideIcon, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MyQuests = () => {
  const user = useQuery(api.users.getCurrent);
  const userQuests = useQuery(api.userQuests.count) ?? 0;
  const completedQuests = useQuery(api.userQuests.countCompleted) ?? 0;
  const questsByCategory = useQuery(api.userQuests.getByCategory);
  const removeQuest = useMutation(api.userQuests.deleteForever);
  const updateStatus = useMutation(api.userQuests.setStatus);

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
    <div className="flex flex-col gap-4">
      {userQuests > 0 && (
        <div className="flex items-center">
          <ProgressBar
            label="Progress"
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
          />
        </div>
      )}
      <Nav>
        {(Object.keys(CORE_CATEGORIES) as CoreCategory[]).map((category) => {
          const userQuest = questsByCategory?.[category]?.[0];
          const config = CORE_CATEGORIES[category];

          if (category === "birthCertificate" && user?.birthplace === "other") {
            return null;
          }

          if (userQuest) {
            return (
              <NavItem
                key={userQuest._id}
                href={{
                  to: "/quests/$questSlug",
                  params: { questSlug: userQuest.slug },
                }}
                icon={config.icon}
                size="large"
                actions={
                  <StatusSelect
                    status={userQuest.status as Status}
                    onChange={(status) =>
                      handleStatusChange(userQuest.questId, status)
                    }
                    onRemove={() => handleRemoveQuest(userQuest.questId)}
                    condensed
                  />
                }
              >
                {userQuest.title}
                {userQuest.jurisdiction && (
                  <Badge size="xs">{userQuest.jurisdiction}</Badge>
                )}
              </NavItem>
            );
          }

          return (
            <NavItem
              key={category}
              href={{
                to: "/quests/$questSlug",
                params: { questSlug: config.to },
              }}
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
              <NavGroup key={label}>
                {quests.map((quest) => (
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
                ))}
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
      toast.success("Added to your list");
    } catch (err) {
      toast.error("Failed to update quest. Please try again.");
    }
  };

  const handleRemoveQuest = async () => {
    try {
      await removeQuest({ questId: quest._id });
      toast.success("Removed from your list");
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
  const activeQuestsCount = activeQuests?.length ?? 0;
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
        placeholder={`Search ${activeQuestsCount} quests`}
        aria-label="Search"
        value={search}
        onChange={setSearch}
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

export const QuestsNav = () => {
  return (
    <Tabs size="small">
      <TabList>
        <Tab id="My quests">My quests</Tab>
        <Tab id="All quests">All quests</Tab>
      </TabList>
      <TabPanel id="My quests">
        <MyQuests />
      </TabPanel>
      <TabPanel id="All quests">
        <AllQuests />
      </TabPanel>
    </Tabs>
  );
};
