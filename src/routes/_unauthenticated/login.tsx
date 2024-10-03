import {
  Banner,
  Button,
  Card,
  Form,
  Link,
  Logo,
  Separator,
  TextField,
} from "@/components";
import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_unauthenticated/login")({
  component: LoginRoute,
});

const SignIn = () => {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp" | "reset">("signIn");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (flow === "reset")
    return <ForgotPassword onBack={() => setFlow("signIn")} />;

  return (
    <Card>
      <Form
        onSubmit={async (event) => {
          event.preventDefault();
          setIsSubmitting(true);
          setError(null);

          const formData = new FormData(event.currentTarget);
          const result = await signIn("password", {
            redirectTo: "/quests",
            ...formData,
          });

          if (!result.signingIn) {
            setError(
              `Couldn't ${flow === "signIn" ? "sign in" : "register"}. Try again.`,
            );
          }

          if (result.redirect) {
            throw redirect({ to: result.redirect.toString() });
          }
        }}
      >
        {error && <Banner variant="danger">{error}</Banner>}
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
        />
        <TextField label="Password" name="password" type="password" />
        <input name="flow" type="hidden" value={flow} />
        <div className="flex flex-col gap-2">
          <Button type="submit" isDisabled={isSubmitting} variant="primary">
            {flow === "signIn" ? "Sign in" : "Register"}
          </Button>
          <span className="text-gray-dim text-sm text-center">or</span>
          <Button
            onPress={() =>
              flow === "signIn" ? setFlow("signUp") : setFlow("signIn")
            }
          >
            {flow === "signIn" ? "Register" : "Sign in"}
          </Button>
        </div>
        <Separator />
        <Button onPress={() => setFlow("reset")}>Forgot your password?</Button>
      </Form>
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

const ForgotPassword = ({ onBack }: { onBack: () => void }) => {
  const { signIn } = useAuthActions();
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [didSendCode, setDidSendCode] = useState(false);
  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return step === "forgot" ? (
    <Card>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          setIsSubmitting(true);
          const formData = new FormData(event.currentTarget);
          signIn("password", formData)
            .then(() => {
              setStep({ email: formData.get("email") as string });
              setError(null);
              setDidSendCode(true);
            })
            .catch((error) => {
              console.error(error);
              setError(`Couldn't send code. Try again.`);
              setIsSubmitting(false);
            })
            .finally(() => setIsSubmitting(false));
        }}
      >
        <h2 className="text-lg font-medium">Reset password</h2>
        {error && <Banner variant="danger">{error}</Banner>}
        <TextField
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <input name="flow" type="hidden" value="reset" />
        <Button type="submit" variant="primary" isDisabled={isSubmitting}>
          Send code
        </Button>
        <Button onPress={onBack}>Back to sign in</Button>
      </Form>
    </Card>
  ) : (
    <Card>
      <Form
        onSubmit={async (event) => {
          event.preventDefault();
          setIsSubmitting(true);
          const formData = new FormData(event.currentTarget);

          try {
            const result = await signIn("password", {
              redirectTo: "/quests",
              ...formData,
            });
            if (result.redirect) {
              throw redirect({ to: result.redirect.toString() });
            }
          } catch (error) {
            console.error(error);
            setDidSendCode(false);
            setError("Couldn’t reset password. Try again.");
            setIsSubmitting(false);
          }
        }}
      >
        {didSendCode && (
          <Banner variant="success">
            Code emailed. Paste the code below and enter your new password.
          </Banner>
        )}
        {error && <Banner variant="danger">{error}</Banner>}
        <TextField
          name="code"
          label="Code"
          type="text"
          value={code}
          onChange={setCode}
          autoFocus
        />
        <TextField
          name="newPassword"
          label="New password"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
        />
        <input name="email" value={step.email} type="hidden" />
        <input name="flow" value="reset-verification" type="hidden" />
        <Button type="submit" variant="primary" isDisabled={isSubmitting}>
          Reset password
        </Button>
      </Form>
    </Card>
  );
};

function LoginRoute() {
  const isClosed = process.env.NODE_ENV === "production";

  return (
    <div className="flex flex-col w-96 max-w-full mx-auto h-dvh place-content-center gap-8 px-4">
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
