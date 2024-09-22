import { Button, Card, Form, Link, Logo, TextField } from "@/components";
import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_unauthenticated/login")({
  component: LoginRoute,
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

const SignIn = () => {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  return (
    <Card>
      {step === "signIn" ? (
        <SignInWithMagicLink handleLinkSent={() => setStep("linkSent")} />
      ) : (
        <div>
          <p>Check your email.</p>
          <p>A sign-in link has been sent to your email address.</p>
          <Button onPress={() => setStep("signIn")}>Cancel</Button>
        </div>
      )}
    </Card>
  );
};

const ClosedSignups = () => (
  <Card>
    <p>
      Namesake is in active development and currently closed to signups. For
      name change support, join us on{" "}
      <Link href="https://namesake.fyi/chat">Discord</Link>.
    </p>
  </Card>
);

function LoginRoute() {
  const isClosed = process.env.NODE_ENV === "production";

  return (
    <div className="flex flex-col w-96 max-w-full mx-auto h-screen place-content-center gap-8">
      <Logo className="mb-4" />
      {isClosed ? <ClosedSignups /> : <SignIn />}
      <div className="flex gap-4 justify-center">
        <Link href="https://namesake.fyi">Namesake</Link>
        <Link href="https://namesake.fyi/chat">Support</Link>
        <Link href="https://status.namesake.fyi">System Status</Link>
      </div>
    </div>
  );
}
