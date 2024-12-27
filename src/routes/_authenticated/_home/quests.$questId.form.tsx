import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_home/quests/$questId/form",
)({
  component: QuestFormRoute,
});

function QuestFormRoute() {
  return <div>Form placeholder</div>;
}
