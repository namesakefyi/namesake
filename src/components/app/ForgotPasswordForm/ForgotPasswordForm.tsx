import { ChevronLeft, Send } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { Heading } from "react-aria-components";
import { Banner, Button, Form, Link, TextField } from "@/components/common";
import { authClient } from "@/main";

interface SniperResponse {
  url: string;
  image: string;
  provider_pretty: string;
}

interface ForgotPasswordFormProps {
  defaultEmail?: string;
}

export const ForgotPasswordForm = ({
  defaultEmail,
}: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState<string>(defaultEmail ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [didSendEmail, setDidSendEmail] = useState(false);
  const [sniperResponse, setSniperResponse] = useState<SniperResponse | null>(
    null,
  );
  const postHog = usePostHog();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error } = await authClient.forgetPassword({
      email,
      redirectTo: "/reset-password",
      fetchOptions: {
        onSuccess: async () => {
          setDidSendEmail(true);
          const response = await fetch(
            `https://sniperl.ink/v1/render?recipient=${email}&sender=hey@namesake.fyi`,
          );
          if (response.ok) {
            const sniperResponse = await response.json();
            setSniperResponse(sniperResponse);
          }
        },
      },
    });

    if (error) {
      setError(error.statusText || "Something went wrong. Please try again.");
      postHog.captureException(error);
    }

    setIsSubmitting(false);
  };

  if (didSendEmail) {
    return (
      <div className="flex flex-col gap-4">
        <Banner variant="success" icon={Send}>
          Sent! Check your email for a link to reset your password.
        </Banner>
        {sniperResponse && (
          <Link href={sniperResponse.url} button={{ variant: "secondary" }}>
            <img
              src={sniperResponse.image}
              alt={`${sniperResponse.provider_pretty} logo`}
              className="w-5 mr-0.5"
              aria-hidden="true"
            />
            Open {sniperResponse.provider_pretty}
          </Link>
        )}
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className="items-stretch">
      <header className="flex items-center gap-3">
        <Link
          href={{ to: "/signin" }}
          button={{ variant: "icon" }}
          aria-label="Back to sign-in"
          className="-m-2"
        >
          <ChevronLeft />
        </Link>
        <Heading className="text-xl font-semibold">Forgot password</Heading>
      </header>
      {error && <Banner variant="danger">{error}</Banner>}
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        isDisabled={isSubmitting}
        value={email}
        onChange={setEmail}
      />
      <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
        Send reset email
      </Button>
    </Form>
  );
};
