import { Logo, PasswordStrength } from "@/components/app";
import {
  AnimateChangeInHeight,
  Banner,
  Button,
  Card,
  Form,
  Link,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { waitFor } from "@/utils/waitFor";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Navigate, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { ConvexError } from "convex/values";
import { ChevronLeft } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useRef, useState } from "react";
import type { Key } from "react-aria";
import { toast } from "sonner";

export const Route = createFileRoute("/_unauthenticated/signin")({
  component: LoginRoute,
});

const SignIn = () => {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<Key>("signIn");
  const [isCodeRequired, setIsCodeRequired] = useState(true);
  const [code, setCode] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate({ from: "/signin" });
  const postHog = usePostHog();
  const isSignedIn = useQuery(api.users.isSignedIn);
  const isSignedInRef = useRef(isSignedIn);
  isSignedInRef.current = isSignedIn;

  const passwordState = usePasswordStrength(password);
  const redeemCode = useMutation(api.earlyAccessCodes.redeem);

  const handleCodeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError(null);
      setIsSubmitting(true);
      await redeemCode({
        earlyAccessCodeId: code as Id<"earlyAccessCodes">,
      });
      toast.success("Code redeemed!");
      setIsCodeRequired(false);
    } catch (error) {
      setError(error instanceof ConvexError ? error.message : "Invalid code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (flow === "signUp" && passwordState && passwordState.score < 3) {
        let errorMessage = "Please choose a stronger password.";
        if (passwordState.feedback.warning) {
          errorMessage += ` ${passwordState.feedback.warning}`;
        }
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }
      await signIn("password", {
        flow,
        email,
        password,
        redirectTo: "/",
      });
      // Wait for user signin to complete before redirecting
      await waitFor(() => !!isSignedInRef.current);
      navigate({ to: "/" });
    } catch (error) {
      setError("Couldn't sign in. Check your information and try again.");
      postHog.captureException(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (flow === "reset") {
    return (
      <ForgotPassword onBack={() => setFlow("signIn")} defaultEmail={email} />
    );
  }

  return (
    <Tabs selectedKey={flow} onSelectionChange={setFlow}>
      <TabList>
        <Tab id="signIn">Sign in</Tab>
        <Tab id="signUp">Register</Tab>
      </TabList>
      <TabPanel id="signIn">
        <Form onSubmit={handleSubmit} className="items-stretch">
          {error && <Banner variant="danger">{error}</Banner>}
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            isRequired
            value={email}
            onChange={setEmail}
            isDisabled={isSubmitting}
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
            isDisabled={isSubmitting}
          />
          <Button type="submit" isSubmitting={isSubmitting} variant="primary">
            Sign in
          </Button>
        </Form>
      </TabPanel>
      <TabPanel id="signUp">
        {import.meta.env.PROD && isCodeRequired ? (
          <Form onSubmit={handleCodeSubmit} className="items-stretch">
            <Banner>
              Namesake is in early access. To register, please enter a code.
            </Banner>
            {error && <Banner variant="danger">{error}</Banner>}
            <TextField
              label="Early Access Code"
              name="code"
              type="text"
              isRequired
              value={code}
              onChange={setCode}
              minLength={32}
              maxLength={32}
            />
            <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
              Continue
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleSubmit} className="items-stretch">
            {error && <Banner variant="danger">{error}</Banner>}
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
            {password && passwordState && (
              <PasswordStrength value={passwordState.score} className="-mt-4" />
            )}
            <Button type="submit" isSubmitting={isSubmitting} variant="primary">
              Register
            </Button>
            <p className="text-sm text-dim text-center text-balance">
              By registering, you agree to Namesake’s{" "}
              <Link
                href="https://namesake.fyi/terms"
                target="_blank"
                rel="noreferrer"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="https://namesake.fyi/privacy"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </Link>
              .
            </p>
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
  const postHog = usePostHog();
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [email, setEmail] = useState<string>(defaultEmail ?? "");
  const [didSendCode, setDidSendCode] = useState(false);
  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordState = usePasswordStrength(newPassword);
  const isSignedIn = useQuery(api.users.isSignedIn);
  const isSignedInRef = useRef(isSignedIn);
  isSignedInRef.current = isSignedIn;

  const handleForgotSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      setIsSubmitting(true);

      await signIn("password", {
        flow: "reset",
        email,
      });
      setStep({ email });
      setError(null);
      setDidSendCode(true);
    } catch (error) {
      postHog.captureException(error);
      if (error instanceof ConvexError) {
        setError(error.message);
      } else {
        setError("Couldn't send code. Is this email correct?");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === "forgot") return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (passwordState && passwordState.score < 3) {
        setError(
          `Please choose a stronger password. ${passwordState.feedback.warning}`,
        );
        setIsSubmitting(false);
        return;
      }
      await signIn("password", {
        flow: "reset-verification",
        email: step.email,
        code,
        newPassword,
      });
      // Wait for user signin to complete before redirecting
      await waitFor(() => !!isSignedInRef.current);
      navigate({ to: "/" });
      toast.success("Password reset!");
    } catch (error) {
      postHog.captureException(error);
      setDidSendCode(false);
      setError("Couldn’t reset password. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return step === "forgot" ? (
    <Form onSubmit={handleForgotSubmit} className="items-stretch">
      <header className="flex items-center gap-3">
        <Button
          onPress={onBack}
          icon={ChevronLeft}
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
      <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
        Send code
      </Button>
    </Form>
  ) : (
    <Form className="items-stretch" onSubmit={handleCodeSubmit}>
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
      {passwordState && (
        <PasswordStrength value={passwordState.score} className="-mt-2" />
      )}
      <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
        Reset password
      </Button>
    </Form>
  );
};

function LoginRoute() {
  return (
    <>
      <Unauthenticated>
        <div className="flex flex-col w-96 max-w-full mx-auto min-h-dvh items-center justify-center gap-8 p-4">
          <Link href="https://namesake.fyi">
            <Logo />
          </Link>
          <AnimateChangeInHeight className="w-full">
            <Card>
              <SignIn />
            </Card>
          </AnimateChangeInHeight>
          <div className="flex gap-4 justify-center text-sm">
            <Link href="https://github.com/namesakefyi/namesake/releases">{`v${APP_VERSION}`}</Link>
            <Link href="https://namesake.fyi/chat">Support</Link>
            <Link href="https://status.namesake.fyi">Status</Link>
          </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        <Navigate to="/" />
      </Authenticated>
    </>
  );
}
