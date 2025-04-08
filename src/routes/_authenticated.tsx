import { AppMobileNav } from "@/components/app";
import { useIsMobile } from "@/utils/useIsMobile";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Authenticated } from "convex/react";
import { tv } from "tailwind-variants";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { isAuthenticated, isLoading } = await context.auth;
    if (!isLoading && !isAuthenticated) throw redirect({ to: "/signin" });
  },
  component: AuthenticatedRoute,
});

function AuthenticatedRoute() {
  const isMobile = useIsMobile();

  const styles = tv({
    variants: {
      isMobile: {
        true: "min-h-dvh pb-14",
      },
    },
  });

  return (
    <Authenticated>
      <main className={styles({ isMobile })}>
        <Outlet />
        {isMobile && <AppMobileNav />}
      </main>
    </Authenticated>
  );
}
