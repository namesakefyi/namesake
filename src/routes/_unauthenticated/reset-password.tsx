import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "@/components/app";
import { SignInWrapper } from "@/components/app/SignInWrapper/SignInWrapper";

export const Route = createFileRoute("/_unauthenticated/reset-password")({
  component: ResetPasswordRoute,
});

function ResetPasswordRoute() {
  return (
    <SignInWrapper>
      <ResetPasswordForm />
    </SignInWrapper>
  );
}
