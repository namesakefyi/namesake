import "./styles/index.css";
import { api } from "@convex/_generated/api";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createAuthClient } from "better-auth/react";
import { ConvexReactClient, useQuery } from "convex/react";
import { ArrowLeft, CircleAlert, TriangleAlert } from "lucide-react";
import { domAnimation, LazyMotion } from "motion/react";
import { posthog } from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-js/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Logo, ThemeProvider } from "@/components/app";
import { Empty } from "@/components/common";
import type { Role } from "@/constants";
import { routeTree } from "./routeTree.gen";

const apiEndpoint = import.meta.env.VITE_CONVEX_URL;
const convex = new ConvexReactClient(apiEndpoint);

const actionsEndpoint = import.meta.env.VITE_CONVEX_SITE_URL;
export const authClient = createAuthClient({
  baseURL: actionsEndpoint,
  plugins: [convexClient(), crossDomainClient()],
});

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

  return <RouterProvider router={router} context={{ convex, title, role }} />;
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
          <ConvexBetterAuthProvider client={convex} authClient={authClient}>
            <ThemeProvider attribute="class">
              <LazyMotion strict features={domAnimation}>
                <PostHogErrorBoundary fallback={fallback}>
                  <InnerApp />
                </PostHogErrorBoundary>
              </LazyMotion>
            </ThemeProvider>
          </ConvexBetterAuthProvider>
        </HelmetProvider>
      </PostHogProvider>
    </StrictMode>,
  );
}
