import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/quests/")({
  beforeLoad: async () => {
    // Todo: redirect to last viewed quest (https://github.com/namesakefyi/namesake/issues/642)
  },
});
