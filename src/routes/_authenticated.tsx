import { AppMobileNav } from "@/components/app";
import { useIsMobile } from "@/utils/useIsMobile";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Authenticated } from "convex/react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { isAuthenticated, isLoading } = await context.auth;
    if (!isLoading && !isAuthenticated) throw redirect({ to: "/signin" });
  },
  component: AuthenticatedRoute,
});

function AuthenticatedRoute() {
  const isMobile = useIsMobile();

  return (
    <Authenticated>
      <main className="grid grid-rows-[1fr_auto] h-screen min-h-0">
        <Outlet />
        {isMobile && <AppMobileNav />}
      </main>
    </Authenticated>
  );
}
