import type { Role } from "@convex/constants";
import {
  type NavigateOptions,
  Outlet,
  type ToOptions,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import type { ConvexAuthState } from "convex/react";
import React, { Suspense } from "react";
import { RouterProvider } from "react-aria-components";

declare module "react-aria-components" {
  interface RouterConfig {
    href: ToOptions | string;
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

interface RouterContext {
  title: string;
  auth: Promise<ConvexAuthState>;
  role: Role;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootRoute,
});

function RootRoute() {
  const router = useRouter();

  const TanStackRouterDevtools =
    process.env.NODE_ENV === "production"
      ? () => null // Render nothing in production
      : React.lazy(() =>
          // Lazy load in development
          import("@tanstack/router-devtools").then((res) => ({
            default: res.TanStackRouterDevtools,
          })),
        );

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
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </RouterProvider>
  );
}
