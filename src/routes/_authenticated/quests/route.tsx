import {
  Badge,
  Button,
  Container,
  Empty,
  Form,
  GridList,
  GridListItem,
  Modal,
} from "@/components";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { RiAddLine, RiSignpostLine } from "@remixicon/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { useState } from "react";
import type { Selection } from "react-aria-components";

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
  const availableQuests = useQuery(api.usersQuests.getAvailableQuestsForUser);
  const hasAvailableQuests = availableQuests && availableQuests.length > 0;
  const addQuest = useMutation(api.usersQuests.create);

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
            {availableQuests.map((quest) => (
              <GridListItem
                key={quest._id}
                id={quest._id}
                textValue={quest.title}
              >
                {quest.title}
                {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
                {quest.steps &&
                  quest.steps.length > 0 &&
                  `${quest.steps?.length} steps`}
              </GridListItem>
            ))}
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
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);

  const MyQuests = () => {
    const myQuests = useQuery(api.usersQuests.getQuestsForCurrentUser);

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

    return (
      <GridList aria-label="My quests">
        {myQuests.map((quest) => {
          if (quest === null) return null;

          return (
            <GridListItem
              textValue={quest.title}
              key={quest._id}
              href={{ to: "/quests/$questId", params: { questId: quest._id } }}
            >
              <div className="flex items-baseline gap-2">
                <p className="font-bold text-lg">{quest.title}</p>
                {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
              </div>
            </GridListItem>
          );
        })}
        <GridListItem
          textValue="Add quest"
          onAction={() => setIsNewQuestModalOpen(true)}
        >
          <RiAddLine /> Add quest
        </GridListItem>
      </GridList>
    );
  };

  return (
    <Container>
      <Authenticated>
        <div className="grid grid-cols-2 items-start gap-4">
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
