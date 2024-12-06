import "./styles/index.css";
import { Logo } from "@/components/app";
import { Empty } from "@/components/common";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  type ConvexAuthState,
  ConvexReactClient,
  useConvexAuth,
  useQuery,
} from "convex/react";
import { LazyMotion, domAnimation } from "framer-motion";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { ThemeProvider } from "next-themes";
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
        href: { to: "/" },
        button: {
          variant: "secondary",
        },
      }}
    />
  </div>
);

const router = createRouter({
  routeTree,
  context: {
    title: undefined!,
    auth: undefined!,
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

let resolveAuth: (client: ConvexAuthState) => void;
const authClient: Promise<ConvexAuthState> = new Promise((resolve) => {
  resolveAuth = resolve;
});

const InnerApp = () => {
  const title = "Namesake";
  const auth = useConvexAuth();
  const role = useQuery(api.users.getCurrentRole) ?? undefined;

  useEffect(() => {
    if (auth.isLoading) return;

    resolveAuth(auth);
  }, [auth, auth.isLoading]);

  return (
    <RouterProvider
      router={router}
      context={{ title, auth: authClient, role }}
    />
  );
};

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <HelmetProvider>
        <ConvexAuthProvider client={convex}>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <LazyMotion strict features={domAnimation}>
              <InnerApp />
            </LazyMotion>
          </ThemeProvider>
        </ConvexAuthProvider>
      </HelmetProvider>
    </StrictMode>,
  );
}
