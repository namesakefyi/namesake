import "./styles/index.css";
import { Logo } from "@/components/app";
import { Empty } from "@/components/common";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import type { Jurisdiction, Role } from "@convex/constants";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  type ConvexAuthState,
  ConvexReactClient,
  useConvexAuth,
  useQuery,
} from "convex/react";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import { ThemeProvider } from "next-themes";
import { posthog } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { StrictMode, useEffect } from "react";
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
    auth: undefined!,
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

let resolveAuth: (client: ConvexAuthState) => void;
const authClient: Promise<ConvexAuthState> = new Promise((resolve) => {
  resolveAuth = resolve;
});

const InnerApp = () => {
  const title = "Namesake";
  const auth = useConvexAuth();
  const user = useQuery(api.users.getCurrent);
  const role = user?.role as Role;
  const residence = user?.residence as Jurisdiction;
  const birthplace = user?.birthplace as Jurisdiction;

  useEffect(() => {
    if (auth.isLoading) return;

    resolveAuth(auth);
  }, [auth, auth.isLoading]);

  return (
    <RouterProvider
      router={router}
      context={{ convex, title, auth: authClient, role, residence, birthplace }}
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

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <PostHogProvider client={posthog}>
        <HelmetProvider>
          <ConvexAuthProvider client={convex}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
              <LazyMotion strict features={domAnimation}>
                <InnerApp />
              </LazyMotion>
            </ThemeProvider>
          </ConvexAuthProvider>
        </HelmetProvider>
      </PostHogProvider>
    </StrictMode>,
  );
}
