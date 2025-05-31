import { authClient } from "@/main";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

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
