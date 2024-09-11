import {
  type NavigateOptions,
  Outlet,
  type ToOptions,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import type { ConvexAuthState } from "convex/react";
import { RouterProvider } from "react-aria-components";
import { AppHeader } from "../components";

declare module "react-aria-components" {
  interface RouterConfig {
    href: ToOptions;
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

interface RouterContext {
  title: string;
  auth: ConvexAuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootRoute,
});

function RootRoute() {
  const router = useRouter();

  return (
    <RouterProvider
      navigate={(path, options) => router.navigate({ ...path, ...options })}
      useHref={(path) => router.buildLocation(path).href}
    >
      <main className="flex flex-col flex-1 min-h-screen text-gray-normal">
        <AppHeader />
        <Outlet />
      </main>
    </RouterProvider>
  );
}
