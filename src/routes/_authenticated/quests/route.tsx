import {
  Badge,
  Button,
  Container,
  Empty,
  Form,
  GridList,
  GridListItem,
  Modal,
  ProgressBar,
  Tooltip,
  TooltipTrigger,
} from "@/components";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { ICONS, type SortQuestsBy } from "@convex/constants";
import {
  RiAddLine,
  RiCheckLine,
  RiCheckboxMultipleBlankLine,
  RiCheckboxMultipleFill,
  RiSignpostLine,
  RiSortNumberAsc,
  RiSortNumberDesc,
} from "@remixicon/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { useEffect, useState } from "react";
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
  const [showCompleted, setShowCompleted] = useState(
    localStorage.getItem("showCompleted") === "true",
  );
  const [sortBy, setSortBy] = useState<SortQuestsBy>(
    (localStorage.getItem("sortQuestsBy") as SortQuestsBy) ?? "newest",
  );
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);

  const toggleSortByMenu = () => {
    if (sortBy === "newest") setSortBy("oldest");
    else setSortBy("newest");
  };

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  useEffect(() => {
    localStorage.setItem("showCompleted", showCompleted.toString());
  }, [showCompleted]);

  useEffect(() => {
    localStorage.setItem("sortQuestsBy", sortBy);
  }, [sortBy]);

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
      switch (sortBy) {
        case "oldest":
          return a._creationTime - b._creationTime;
        case "newest":
          return b._creationTime - a._creationTime;
        default:
          return 0;
      }
    });

    const filteredQuests = sortedQuests.filter((quest) => {
      if (showCompleted) return true;
      return !quest.completionTime;
    });

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <ProgressBar
            label="Quests complete"
            value={completedQuests}
            maxValue={totalQuests}
            valueLabel={`${completedQuests} of ${totalQuests}`}
            className="mr-4"
          />
          {Boolean(completedQuests && completedQuests > 0) && (
            <TooltipTrigger>
              <Button
                aria-label="Show completed quests"
                onPress={toggleShowCompleted}
                icon={
                  showCompleted
                    ? RiCheckboxMultipleFill
                    : RiCheckboxMultipleBlankLine
                }
                variant="icon"
              />
              <Tooltip>
                {`${showCompleted ? "Hide" : "Show"} completed quests`}
              </Tooltip>
            </TooltipTrigger>
          )}
          <TooltipTrigger>
            <Button
              aria-label="Sort by"
              onPress={() => toggleSortByMenu()}
              icon={sortBy === "newest" ? RiSortNumberAsc : RiSortNumberDesc}
              variant="icon"
            />
            <Tooltip>{`Sort by ${sortBy === "newest" ? "oldest" : "newest"}`}</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <Button
              aria-label="Add quest"
              onPress={() => setIsNewQuestModalOpen(true)}
              icon={RiAddLine}
              variant="icon"
            />
            <Tooltip>Add quest</Tooltip>
          </TooltipTrigger>
        </div>
        <GridList aria-label="My quests">
          {filteredQuests.map((quest) => {
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
                    <Icon size={20} className="text-gray-dim" />
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
          {!showCompleted && completedQuests && completedQuests > 0 && (
            <GridListItem
              textValue="Show completed"
              onAction={() => setShowCompleted(true)}
            >
              <div className="flex items-center justify-start gap-2 w-full text-gray-dim">
                <RiCheckLine size={20} />
                {`${completedQuests} completed ${completedQuests > 1 ? "quests" : "quest"} hidden`}
              </div>
            </GridListItem>
          )}
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
