import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Badge,
  Container,
  GridList,
  GridListItem,
  PageHeader,
} from "../components/shared";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

function IndexRoute() {
  const MyQuests = () => {
    const myQuests = useQuery(api.usersQuests.getQuestsForCurrentUser);

    if (myQuests === undefined) return;

    if (myQuests === null || myQuests.length === 0) return "No quests";

    return (
      <GridList aria-label="My quests">
        {myQuests.map((quest) => {
          if (quest === null) return null;

          return (
            <GridListItem textValue={quest.title} key={quest._id}>
              <div className="flex items-baseline gap-2">
                <p className="font-bold text-lg">{quest.title}</p>
                {quest.state && <Badge>{quest.state}</Badge>}
              </div>
            </GridListItem>
          );
        })}
      </GridList>
    );
  };

  return (
    <Container>
      <Authenticated>
        <PageHeader title="My Quests" />
        <MyQuests />
      </Authenticated>
      <Unauthenticated>Please log in</Unauthenticated>
    </Container>
  );
}
