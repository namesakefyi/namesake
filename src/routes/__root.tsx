import { useAuthActions } from "@convex-dev/auth/react";
import {
  type NavigateOptions,
  Outlet,
  type ToOptions,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { type ConvexAuthState, useConvexAuth } from "convex/react";
import { useState } from "react";
import { RouterProvider } from "react-aria-components";
import type { Role } from "../../convex/types";
import { AppHeader, Button, Form, Logo, TextField } from "../components";

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
  const { isAuthenticated } = useConvexAuth();

  const SignInWithMagicLink = ({
    handleLinkSent,
  }: {
    handleLinkSent: () => void;
  }) => {
    const { signIn } = useAuthActions();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          setIsSubmitting(true);
          setError(null);

          const formData = new FormData(event.currentTarget);
          signIn("resend", formData)
            .then(handleLinkSent)
            .catch((error) => {
              console.error(error);
              setError("Could not send sign-in link. Please try again.");
              setIsSubmitting(false);
            });
        }}
      >
        {/* TODO: Make a banner component */}
        {error && <p>{error}</p>}
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
        />
        <Button type="submit" isDisabled={isSubmitting} variant="primary">
          Send sign-in link
        </Button>
      </Form>
    );
  };

  const SignIn = () => {
    const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

    return (
      <div className="flex flex-col w-screen h-screen place-content-center gap-12">
        <Logo />
        <div className="p-6 rounded-lg bg-gray-subtle border border-gray-dim w-96 max-w-full mx-auto">
          {step === "signIn" ? (
            <SignInWithMagicLink handleLinkSent={() => setStep("linkSent")} />
          ) : (
            <div>
              <p>Check your email.</p>
              <p>A sign-in link has been sent to your email address.</p>
              <Button onPress={() => setStep("signIn")}>Cancel</Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const App = () => (
    <main className="flex flex-col flex-1 min-h-screen text-gray-normal">
      <AppHeader />
      <Outlet />
    </main>
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
      {!isAuthenticated ? <SignIn /> : <App />}
    </RouterProvider>
  );
}
