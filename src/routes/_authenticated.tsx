import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { tv } from "tailwind-variants";
import { AppNav } from "@/components/app";
import { useIsMobile } from "@/hooks/useIsMobile";

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
        <div className={styles({ isMobile })}>
          <Outlet />
          {isMobile && <AppNav />}
        </div>
      </Authenticated>
      <Unauthenticated>
        <Navigate to="/signin" />
      </Unauthenticated>
    </>
  );
}
