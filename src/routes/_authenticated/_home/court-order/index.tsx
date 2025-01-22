import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/court-order/")({
  beforeLoad: async ({ context: { residence } }) => {
    if (residence) {
      throw redirect({
        to: "/court-order/$jurisdiction",
        params: {
          jurisdiction: residence.toLowerCase(),
        },
      });
    }
  },
});
