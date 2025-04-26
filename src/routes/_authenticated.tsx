import { AppMobileNav } from "@/components/app";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Navigate, Outlet, createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { tv } from "tailwind-variants";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedRoute,
});

function AuthenticatedRoute() {
  const isMobile = useIsMobile();

  const styles = tv({
    base: "min-h-dvh flex flex-col *:flex-1",
    variants: {
      isMobile: {
        true: "pb-14",
      },
    },
  });

  return (
    <>
      <Authenticated>
        <main className={styles({ isMobile })}>
          <Outlet />
          {isMobile && <AppMobileNav />}
        </main>
      </Authenticated>
      <Unauthenticated>
        <Navigate to="/signin" />
      </Unauthenticated>
    </>
  );
}
