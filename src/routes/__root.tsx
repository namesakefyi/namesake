import type { Role } from "@convex/constants";
import {
  RiAlertLine,
  RiCheckLine,
  RiInformationLine,
  RiLoader4Line,
  RiSpam2Line,
} from "@remixicon/react";
import {
  type NavigateOptions,
  Outlet,
  type ToOptions,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import type { ConvexAuthState } from "convex/react";
import { useTheme } from "next-themes";
import React, { Suspense } from "react";
import { RouterProvider } from "react-aria-components";
import { Toaster } from "sonner";

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
  const { theme } = useTheme();

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
      <Toaster
        theme={theme as "light" | "dark" | "system"}
        offset={16}
        gap={8}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "bg-gray-12 dark:bg-graydark-12 rounded-lg p-4 w-full font-sans text-sm shadow-md flex items-center gap-2 text-gray-1 dark:text-graydark-1",
            title: "text-gray-1 dark:text-graydark-1",
            description: "text-gray-3 dark:text-graydark-3",
            icon: "text-gray-5 dark:text-graydark-5",
          },
        }}
        icons={{
          success: <RiCheckLine />,
          info: <RiInformationLine />,
          warning: <RiAlertLine />,
          error: <RiSpam2Line />,
          loading: <RiLoader4Line />,
        }}
      />
    </RouterProvider>
  );
}
