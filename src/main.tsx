import "./styles/index.css";
import { Logo, ThemeProvider } from "@/components/app";
import { Empty } from "@/components/common";
import type { Jurisdiction, Role } from "@/constants";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ConvexReactClient, useQuery } from "convex/react";
import { ArrowLeft, CircleAlert, TriangleAlert } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import { posthog } from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-js/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { routeTree } from "./routeTree.gen";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const NotFoundComponent = () => (
  <div className="flex flex-col items-center justify-center gap-12 w-full min-h-screen px-4">
    <Logo />
    <Empty
      title="Page not found"
      subtitle="We couldn't find that page."
      icon={TriangleAlert}
      className="min-h-0 flex-none"
      button={{
        children: "Go back",
        icon: ArrowLeft,
        onPress: () => {
          router.history.go(-1);
        },
      }}
      link={{
        children: "Go home",
        href: "/",
        button: {
          variant: "secondary",
        },
      }}
    />
  </div>
);

export const router = createRouter({
  routeTree,
  context: {
    convex: undefined!,
    title: undefined!,
    role: undefined!,
    residence: undefined!,
    birthplace: undefined!,
  },
  defaultPreload: "intent",
  defaultNotFoundComponent: NotFoundComponent,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const title = "Namesake";
  const user = useQuery(api.users.getCurrent);
  const role = user?.role as Role;
  const residence = user?.residence as Jurisdiction;
  const birthplace = user?.birthplace as Jurisdiction;

  return (
    <RouterProvider
      router={router}
      context={{ convex, title, role, residence, birthplace }}
    />
  );
};

posthog.init(import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST,
  // Since we're using TanStack Router, we need to track pageviews manually
  capture_pageview: false,
  // Enable web vitals
  capture_performance: {
    web_vitals: true,
  },
});

const fallback = () => (
  <Empty
    title="Something went wrong"
    subtitle="We've been notified of the issue. Refresh the page to try again."
    icon={CircleAlert}
    className="min-h-dvh"
  />
);

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <PostHogProvider client={posthog}>
        <HelmetProvider>
          <ConvexAuthProvider client={convex}>
            <ThemeProvider attribute="class">
              <LazyMotion strict features={domAnimation}>
                <PostHogErrorBoundary fallback={fallback}>
                  <InnerApp />
                </PostHogErrorBoundary>
              </LazyMotion>
            </ThemeProvider>
          </ConvexAuthProvider>
        </HelmetProvider>
      </PostHogProvider>
    </StrictMode>,
  );
}
