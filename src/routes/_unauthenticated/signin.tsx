import {
  AnimateChangeInHeight,
  Banner,
  Button,
  Card,
  Form,
  Link,
  Logo,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Tooltip,
  TooltipTrigger,
} from "@/components";
import { useAuthActions } from "@convex-dev/auth/react";
import { RiArrowLeftSLine } from "@remixicon/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { ConvexError } from "convex/values";
import { useEffect, useState } from "react";
import type { Key } from "react-aria";

export const Route = createFileRoute("/_unauthenticated/signin")({
  component: LoginRoute,
});

const SignIn = () => {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<Key>("signIn");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate({ from: "/signin" });
  const isClosed = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/quests" });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn("password", {
        flow,
        email,
        password,
        redirectTo: "/quests",
      });

      if (!result) {
        setError(
          `Couldn't ${flow === "signIn" ? "sign in" : "register"}. Try again.`,
        );
        return;
      }

      if (result.redirect) {
        navigate({ to: result.redirect.toString() });
        return;
      }
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        setError(error.message);
      } else {
        setError("Something went wrong. Try again.");
      }
      setIsSubmitting(false);
    }
  };

  if (flow === "reset")
    return (
      <ForgotPassword onBack={() => setFlow("signIn")} defaultEmail={email} />
    );

  return (
    <Tabs selectedKey={flow} onSelectionChange={setFlow}>
      <TabList>
        <Tab id="signIn">Sign in</Tab>
        <Tab id="signUp">Register</Tab>
      </TabList>
      {error && <Banner variant="danger">{error}</Banner>}
      <TabPanel id="signIn">
        <Form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            isRequired
            value={email}
            onChange={setEmail}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            isRequired
            suffix={
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="small"
                  onPress={() => setFlow("reset")}
                >
                  Forgot?
                </Button>
                <Tooltip>Reset password</Tooltip>
              </TooltipTrigger>
            }
            value={password}
            onChange={setPassword}
          />
          <Button type="submit" isDisabled={isSubmitting} variant="primary">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </Form>
      </TabPanel>
      <TabPanel id="signUp">
        {isClosed ? (
          <Banner variant="info">
            <p>
              Namesake is in active development and currently closed to signups.
              For name change support, join us on{" "}
              <Link href="https://namesake.fyi/chat">Discord</Link>.
            </p>
          </Banner>
        ) : (
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              isRequired
              value={email}
              onChange={setEmail}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              isRequired
              value={password}
              onChange={setPassword}
            />
            <Button type="submit" isDisabled={isSubmitting} variant="primary">
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </Form>
        )}
      </TabPanel>
    </Tabs>
  );
};

const ForgotPassword = ({
  onBack,
  defaultEmail,
}: { onBack: () => void; defaultEmail?: string }) => {
  const navigate = useNavigate({ from: "/signin" });
  const { signIn } = useAuthActions();
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [email, setEmail] = useState<string>(defaultEmail ?? "");
  const [didSendCode, setDidSendCode] = useState(false);
  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return step === "forgot" ? (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        setIsSubmitting(true);

        signIn("password", {
          flow: "reset",
          email,
        })
          .then(() => {
            setStep({ email });
            setError(null);
            setDidSendCode(true);
          })
          .catch((error) => {
            console.error(error);
            if (error instanceof ConvexError) {
              setError(error.message);
            } else {
              setError("Couldn't send code. Is this email correct?");
            }
            setIsSubmitting(false);
          })
          .finally(() => setIsSubmitting(false));
      }}
    >
      <header className="flex items-center gap-3">
        <Button
          onPress={onBack}
          icon={RiArrowLeftSLine}
          variant="icon"
          aria-label="Back to sign-in"
          className="-m-2"
        />
        <h2 className="text-lg font-medium">Reset password</h2>
      </header>
      {error && <Banner variant="danger">{error}</Banner>}
      <TextField
        name="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
      />
      <Button type="submit" variant="primary" isDisabled={isSubmitting}>
        Send code
      </Button>
    </Form>
  ) : (
    <Form
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
          const result = await signIn("password", {
            flow: "reset-verification",
            redirectTo: "/quests",
            email: step.email,
            code,
            newPassword,
          });
          if (result.redirect) {
            navigate({ to: result.redirect.toString() });
          }
          navigate({ to: "/quests" });
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
      <Button type="submit" variant="primary" isDisabled={isSubmitting}>
        Reset password
      </Button>
    </Form>
  );
};

function LoginRoute() {
  return (
    <div className="flex flex-col w-96 max-w-full mx-auto min-h-dvh place-content-center gap-8 px-4 py-12">
      <Logo className="mb-4" />
      <AnimateChangeInHeight>
        <Card>
          <SignIn />
        </Card>
      </AnimateChangeInHeight>
      <div className="flex gap-4 justify-center">
        <Link href="https://namesake.fyi">{`Namesake v${APP_VERSION}`}</Link>
        <Link href="https://namesake.fyi/chat">Support</Link>
        <Link href="https://status.namesake.fyi">System Status</Link>
      </div>
    </div>
  );
}
