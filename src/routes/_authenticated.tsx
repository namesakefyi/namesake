import { AppNav } from "@/components/app";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Navigate, Outlet, createFileRoute } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { tv } from "tailwind-variants";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedRoute,
});

function AuthenticatedRoute() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const isMobile = useIsMobile();

  const styles = tv({
    base: "min-h-dvh flex flex-col *:flex-1",
    variants: {
      isMobile: {
        true: "pb-14",
      },
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <main className={styles({ isMobile })}>
        <Outlet />
        {isMobile && <AppNav />}
      </main>
    );
  }

  return <Navigate to="/signin" />;
}
