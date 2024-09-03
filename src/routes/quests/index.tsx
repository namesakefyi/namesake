import { RiAddFill } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Badge,
  Button,
  Container,
  GridList,
  GridListItem,
  PageHeader,
} from "../../components/shared";

export const Route = createFileRoute("/quests/")({
  component: QuestsRoute,
});

function QuestsRoute() {
  const allQuests = useQuery(api.quests.getAllActiveQuests);
  const otherQuests = useQuery(api.usersQuests.getAvailableQuestsForUser);
  const addQuest = useMutation(api.usersQuests.create);

  if (allQuests === undefined) return;
  if (allQuests === null) return null;

  return (
    <Container>
      <PageHeader title="Quests" />
      <GridList
        aria-label="All quests"
        items={allQuests}
        renderEmptyState={() => "No quests found"}
      >
        {allQuests.map(({ _id, _creationTime, title, state }) => {
          const isQuestAdded = !otherQuests?.some((quest) => quest._id === _id);

          return (
            <GridListItem textValue={title} key={_id}>
              {title}
              {state && <Badge>{state}</Badge>}
              {isQuestAdded ? (
                <Badge variant="info">{`Added ${new Date(_creationTime).toLocaleString()}`}</Badge>
              ) : (
                <Button
                  onPress={() => addQuest({ questId: _id })}
                  variant="icon"
                  aria-label="Add quest"
                >
                  <RiAddFill size={16} />
                </Button>
              )}
            </GridListItem>
          );
        })}
      </GridList>
    </Container>
  );
}
