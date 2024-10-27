import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_homelayout/quests/")({
  beforeLoad: async () => {
    throw redirect({
      to: "/",
    });
  },
});
