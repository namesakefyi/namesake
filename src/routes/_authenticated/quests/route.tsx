import {
  Badge,
  Button,
  Container,
  Empty,
  Form,
  GridList,
  GridListItem,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Modal,
  ProgressBar,
} from "@/components";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { ICONS, type SortQuestsBy } from "@convex/constants";
import {
  RiAddLine,
  RiCheckLine,
  RiFilter3Line,
  RiSignpostLine,
} from "@remixicon/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export const Route = createFileRoute("/_authenticated/quests")({
  component: IndexRoute,
});

const NewQuestModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) => {
  const [selectedQuests, setSelectedQuests] = useState<Selection>(new Set());
  const availableQuests = useQuery(api.userQuests.getAvailableQuestsForUser);
  const hasAvailableQuests = availableQuests && availableQuests.length > 0;
  const addQuest = useMutation(api.userQuests.create);

  const clearForm = () => {
    setSelectedQuests(new Set());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (const questId of selectedQuests) {
      addQuest({ questId: questId as Id<"quests"> });
    }

    clearForm();
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form className="w-full" onSubmit={handleSubmit}>
        {hasAvailableQuests ? (
          <GridList
            aria-label="Available quests"
            items={availableQuests}
            selectionMode="multiple"
            selectedKeys={selectedQuests}
            onSelectionChange={setSelectedQuests}
          >
            {availableQuests.map((quest) => {
              const Icon = ICONS[quest.icon];
              return (
                <GridListItem
                  key={quest._id}
                  id={quest._id}
                  textValue={quest.title}
                >
                  <Icon />
                  {quest.title}
                  {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
                  {quest.steps &&
                    quest.steps.length > 0 &&
                    `${quest.steps?.length} steps`}
                </GridListItem>
              );
            })}
          </GridList>
        ) : (
          <Empty title="No more quests" icon={RiSignpostLine} />
        )}
        <div className="flex gap-2 justify-end">
          <Button type="button" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isDisabled={!hasAvailableQuests}
          >
            {selectedQuests === "all"
              ? "Add all quests"
              : selectedQuests.size > 1
                ? `Add ${selectedQuests.size} quests`
                : "Add quest"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

function IndexRoute() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const setSortQuestsBy = useMutation(api.users.setSortQuestsBy);

  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);

  const handleSortByChange = (sortBy: SortQuestsBy) => {
    setSortQuestsBy({ sortQuestsBy: sortBy });
  };

  const MyQuests = () => {
    const myQuests = useQuery(api.userQuests.getQuestsForCurrentUser);
    const completedQuests = useQuery(api.userQuests.getCompletedQuestCount);

    if (myQuests === undefined) return;

    if (myQuests === null || myQuests.length === 0)
      return (
        <Empty
          title="No quests"
          icon={RiSignpostLine}
          button={{
            children: "Add quest",
            variant: "primary",
            onPress: () => setIsNewQuestModalOpen(true),
          }}
        />
      );

    const totalQuests = myQuests.length;

    const sortedQuests = myQuests.sort((a, b) => {
      if (currentUser?.sortQuestsBy === "oldest") {
        // Sort all quests by old to new _creationTime
        return a._creationTime - b._creationTime;
      }
      if (currentUser?.sortQuestsBy === "newest") {
        // Sort all quests by new to old _creationTime
        return b._creationTime - a._creationTime;
      }
      return 0;
    });

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <ProgressBar
            label="Quests complete"
            value={completedQuests}
            maxValue={totalQuests}
            valueLabel={`${completedQuests} of ${totalQuests}`}
          />
          <MenuTrigger>
            <Button
              variant="icon"
              icon={RiFilter3Line}
              aria-label="Filter quests"
            />
            <Menu
              selectionMode="single"
              placement="bottom end"
              selectedKeys={new Set([currentUser?.sortQuestsBy ?? "newest"])}
              onSelectionChange={(keys: Selection) => {
                if (keys === "all") return;
                if (keys.has("newest")) handleSortByChange("newest");
                if (keys.has("oldest")) handleSortByChange("oldest");
              }}
            >
              <MenuSection title="Sort by">
                <MenuItem id="newest">Newest</MenuItem>
                <MenuItem id="oldest">Oldest</MenuItem>
              </MenuSection>
            </Menu>
          </MenuTrigger>
        </div>
        <GridList aria-label="My quests">
          {sortedQuests.map((quest) => {
            if (quest === null) return null;

            const Icon = ICONS[quest.icon];

            return (
              <GridListItem
                textValue={quest.title}
                key={quest._id}
                href={{
                  to: "/quests/$questId",
                  params: { questId: quest._id },
                }}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <div
                    className={twMerge(
                      "flex items-center gap-2",
                      quest.completionTime && "opacity-40",
                    )}
                  >
                    <Icon size={20} />
                    <p>{quest.title}</p>
                    {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
                  </div>
                  {quest.completionTime ? (
                    <RiCheckLine
                      className="text-green-9 dark:text-green-dark-9 ml-auto"
                      size={20}
                    />
                  ) : null}
                </div>
              </GridListItem>
            );
          })}
          <GridListItem
            textValue="Add quest"
            onAction={() => setIsNewQuestModalOpen(true)}
          >
            <RiAddLine size={20} /> Add quest
          </GridListItem>
        </GridList>
      </div>
    );
  };

  return (
    <Container className="max-w-screen-lg">
      <Authenticated>
        <div className="flex gap-6">
          <MyQuests />
          <Outlet />
        </div>
        <NewQuestModal
          isOpen={isNewQuestModalOpen}
          onOpenChange={setIsNewQuestModalOpen}
          onSubmit={() => setIsNewQuestModalOpen(false)}
        />
      </Authenticated>
      <Unauthenticated>
        <h1>Please log in</h1>
      </Unauthenticated>
    </Container>
  );
}
