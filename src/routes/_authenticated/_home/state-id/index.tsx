import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/state-id/")({
  beforeLoad: async ({ context: { residence } }) => {
    if (residence) {
      throw redirect({
        to: "/state-id/$jurisdiction",
        params: {
          jurisdiction: residence.toLowerCase(),
        },
      });
    }
  },
});
