import type { Jurisdiction, Role } from "@convex/constants";
import {
  type NavigateOptions,
  Outlet,
  type ToOptions,
  createRootRouteWithContext,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import type { ConvexAuthState, ConvexReactClient } from "convex/react";
import {
  AlertTriangle,
  Check,
  Info,
  LoaderCircle,
  OctagonAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { RouterProvider } from "react-aria-components";
import { Toaster } from "sonner";

declare module "react-aria-components" {
  interface RouterConfig {
    href: ToOptions | string;
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

function PostHogPageView() {
  const location = useLocation();
  const posthog = usePostHog();
  // Track pageviews
  useEffect(() => {
    if (posthog) {
      posthog.capture("$pageview", {
        $current_url: location.pathname,
      });
    }
  }, [location]);

  return null;
}

interface RouterContext {
  convex: ConvexReactClient;
  title: string;
  auth: Promise<ConvexAuthState>;
  role: Role;
  residence: Jurisdiction;
  birthplace: Jurisdiction;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootRoute,
});

function RootRoute() {
  const router = useRouter();
  const { theme } = useTheme();

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
      <PostHogPageView />
      <Toaster
        theme={theme as "light" | "dark" | "system"}
        offset={16}
        gap={8}
        position="bottom-left"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "bg-gray-12 rounded-lg p-4 w-full font-sans text-sm shadow-md flex items-center gap-2 text-gray-1",
            title: "text-gray-1",
            description: "text-gray-3",
            icon: "text-gray-5",
          },
        }}
        icons={{
          success: <Check />,
          info: <Info />,
          warning: <AlertTriangle />,
          error: <OctagonAlert />,
          loading: <LoaderCircle />,
        }}
      />
    </RouterProvider>
  );
}
