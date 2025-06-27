import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "@/main";

export const Route = createFileRoute("/_authenticated/signout")({
  component: RouteComponent,
});

async function RouteComponent() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => navigate({ to: "/signin" }),
      },
    });
  };

  useEffect(() => {
    handleSignOut();
  }, []);
}
