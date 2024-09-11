import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Badge,
  Container,
  GridList,
  GridListItem,
  PageHeader,
} from "../../components";

export const Route = createFileRoute("/quests/")({
  component: QuestsRoute,
});

function QuestsRoute() {
  const allQuests = useQuery(api.quests.getAllActiveQuests);

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
        {allQuests.map(({ _id, title, jurisdiction }) => (
          <GridListItem textValue={title} key={_id}>
            {title}
            {jurisdiction && <Badge>{jurisdiction}</Badge>}
          </GridListItem>
        ))}
      </GridList>
    </Container>
  );
}
