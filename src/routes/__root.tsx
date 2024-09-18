import {
  type NavigateOptions,
  Outlet,
  type ToOptions,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import type { ConvexAuthState } from "convex/react";
import { RouterProvider } from "react-aria-components";
import type { Role } from "../../convex/constants";
import { AppHeader } from "../components";

declare module "react-aria-components" {
  interface RouterConfig {
    href: ToOptions | string;
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

interface RouterContext {
  title: string;
  auth: ConvexAuthState;
  role: Role;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootRoute,
});

function RootRoute() {
  const router = useRouter();

  return (
    // TODO: Improve this API
    // https://github.com/adobe/react-spectrum/issues/6587
    <RouterProvider
      navigate={(path, options) =>
        router.navigate(
          typeof path === "string" ? { ...options } : { ...path, ...options },
        )
      }
      useHref={(path) =>
        typeof path === "string" ? path : router.buildLocation(path).href
      }
    >
      <main className="flex flex-col flex-1 min-h-screen text-gray-normal">
        <AppHeader />
        <Outlet />
      </main>
    </RouterProvider>
  );
}
