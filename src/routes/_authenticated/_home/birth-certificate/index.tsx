import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_home/birth-certificate/",
)({
  beforeLoad: async ({ context: { birthplace } }) => {
    if (birthplace) {
      throw redirect({
        to: "/birth-certificate/$jurisdiction",
        params: {
          jurisdiction: birthplace.toLowerCase(),
        },
      });
    }
  },
});
