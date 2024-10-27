import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/quests/")({
  beforeLoad: async () => {
    throw redirect({
      to: "/",
    });
  },
});
