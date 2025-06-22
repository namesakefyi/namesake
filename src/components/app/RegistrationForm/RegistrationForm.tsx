import { PasswordStrength } from "@/components/app";
import { Banner, Button, Form, Link, TextField } from "@/components/common";
import { MAX_DISPLAY_NAME_LENGTH, MIN_DISPLAY_NAME_LENGTH } from "@/constants";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { authClient } from "@/main";
import { useNavigate } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";

export const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordState = usePasswordStrength(password);
  const postHog = usePostHog();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (passwordState && passwordState.score < 3) {
      let errorMessage = "Please choose a stronger password.";
      if (passwordState.feedback.warning) {
        errorMessage += ` ${passwordState.feedback.warning}`;
      }
      setError(errorMessage);
      return;
    }

    try {
      await authClient.signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onRequest: () => {
            setIsSubmitting(true);
          },
          onSuccess: () => {
            navigate({ to: "/" });
          },
          onError: ({ error }) => {
            setError(
              error.message ||
                "Couldn't sign in. Check your information and try again.",
            );
            postHog.captureException(error);
          },
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="items-stretch">
      {error && <Banner variant="danger">{error}</Banner>}
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        isDisabled={isSubmitting}
        isRequired
        value={email}
        onChange={setEmail}
      />
      <TextField
        label="Display Name"
        name="name"
        type="text"
        isRequired
        isDisabled={isSubmitting}
        value={name}
        onChange={setName}
        minLength={MIN_DISPLAY_NAME_LENGTH}
        maxLength={MAX_DISPLAY_NAME_LENGTH}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        isDisabled={isSubmitting}
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
      <p className="text-sm text-gray-dim text-center text-balance">
        By registering, you agree to Namesake's{" "}
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
  );
};
