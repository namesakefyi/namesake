import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { Heading } from "react-aria-components";
import { toast } from "sonner";
import { PasswordStrength } from "@/components/app";
import { Banner, Button, Form, TextField } from "@/components/common";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { authClient, router } from "@/main";

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordState = usePasswordStrength(password);
  const postHog = usePostHog();

  const token = new URLSearchParams(window.location.search).get("token");

  if (!token) {
    return (
      <Banner variant="danger">
        Reset password link expired. Please request a new one.
      </Banner>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (passwordState && passwordState.score < 3) {
      let errorMessage = "Please choose a stronger password.";
      if (passwordState.feedback.warning) {
        errorMessage += ` ${passwordState.feedback.warning}`;
      }
      setError(errorMessage);
      setIsSubmitting(false);
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Password reset!");
        },
      },
    });

    if (error) {
      setError(error.message || "Something went wrong. Please try again.");
      postHog.captureException(error);
    } else {
      router.navigate({ to: "/signin" });
    }

    setIsSubmitting(false);
  };

  return (
    <Form onSubmit={handleSubmit} className="items-stretch">
      <header className="flex items-center gap-3">
        <Heading className="text-xl font-semibold">Reset password</Heading>
      </header>
      {error && <Banner variant="danger">{error}</Banner>}
      <TextField
        name="password"
        label="New password"
        type="password"
        isRequired
        isDisabled={isSubmitting}
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
      />
      {password && passwordState && (
        <PasswordStrength value={passwordState.score} className="-mt-4" />
      )}
      <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
        Reset password
      </Button>
    </Form>
  );
};
