import { createFileRoute, Navigate, useSearch } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { z } from "zod";
import { ForgotPasswordForm, SignInWrapper } from "@/components/app";

const searchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute("/_unauthenticated/forgot")({
  validateSearch: searchSchema,
  component: ForgotPasswordRoute,
});

function ForgotPasswordRoute() {
  const { email } = useSearch({ from: "/_unauthenticated/forgot" });

  return (
    <>
      <Unauthenticated>
        <SignInWrapper>
          <ForgotPasswordForm defaultEmail={email} />
        </SignInWrapper>
      </Unauthenticated>
      <Authenticated>
        <Navigate to="/" />
      </Authenticated>
    </>
  );
}
