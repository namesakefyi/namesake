import { ForgotPasswordForm, SignInWrapper } from "@/components/app";
import { Navigate, createFileRoute, useSearch } from "@tanstack/react-router";
import { Authenticated } from "convex/react";
import { Unauthenticated } from "convex/react";
import { z } from "zod";

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
