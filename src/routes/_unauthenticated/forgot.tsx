import { ForgotPasswordForm, SignInWrapper } from "@/components/app";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { Authenticated } from "convex/react";
import { Unauthenticated } from "convex/react";

export const Route = createFileRoute("/_unauthenticated/forgot")({
  component: ForgotPasswordRoute,
});

function ForgotPasswordRoute() {
  return (
    <>
      <Unauthenticated>
        <SignInWrapper>
          <ForgotPasswordForm />
        </SignInWrapper>
      </Unauthenticated>
      <Authenticated>
        <Navigate to="/" />
      </Authenticated>
    </>
  );
}
