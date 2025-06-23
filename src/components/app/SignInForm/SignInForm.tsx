import { useNavigate } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import {
  Banner,
  Button,
  Form,
  Link,
  TextField,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { authClient } from "@/main";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postHog = usePostHog();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error } = await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setIsSubmitting(true);
        },
        onSuccess: () => {
          setIsSubmitting(false);
          navigate({ to: "/" });
        },
      },
    );

    if (error) {
      setError(error?.message || "Something went wrong. Please try again.");
      postHog.captureException(error);
    }

    setIsSubmitting(false);
  };

  return (
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
            <Link
              href={{ to: "/forgot", search: email ? { email } : undefined }}
              button={{ variant: "ghost", size: "small" }}
            >
              Forgot?
            </Link>
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
  );
};
