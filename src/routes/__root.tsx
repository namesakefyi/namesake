import { useTheme } from "@/components/app";
import type { Jurisdiction, Role } from "@/constants";
import {
  type NavigateOptions,
  Outlet,
  type ToOptions,
  createRootRouteWithContext,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import type { ConvexReactClient } from "convex/react";
import {
  AlertTriangle,
  Check,
  Info,
  LoaderCircle,
  OctagonAlert,
} from "lucide-react";
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
    <RouterProvider
      navigate={(path, options) =>
        router.navigate(
          typeof path === "string"
            ? { href: path, ...options }
            : { ...path, ...options },
        )
      }
    >
      <Outlet />
      <PostHogPageView />
      <Toaster
        theme={theme as "light" | "dark" | "system"}
        offset={16}
        mobileOffset={{ bottom: "68px" }}
        gap={8}
        position="bottom-right"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "bg-theme-12 rounded-lg p-4 w-full font-sans text-sm shadow-md flex items-center gap-2 text-theme-1",
            title: "text-theme-1",
            description: "text-theme-3",
            icon: "text-theme-5",
            actionButton: "ml-auto cursor-pointer",
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
