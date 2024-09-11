import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Form, TextField } from "../components";

export const Route = createFileRoute("/signin")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      // TODO: Fix this. `isAuthenticated` isn't working
      throw redirect({
        to: "/",
      });
    }
  },
  component: SignInRoute,
});

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
      <TextField label="Email" name="email" type="email" autoComplete="email" />
      <Button type="submit" isDisabled={isSubmitting} variant="primary">
        Send sign-in link
      </Button>
    </Form>
  );
};

function SignInRoute() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  return (
    <div className="flex flex-col place-content-center flex-1">
      <div className="p-4 rounded-lg bg-gray-subtle border border-gray-dim w-96 max-w-full mx-auto">
        <h2 className="text-xl mb-4">Sign in or create an account</h2>
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
}
