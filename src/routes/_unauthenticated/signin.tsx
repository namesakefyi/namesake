import { Logo } from "@/components/app";
import { Link } from "@/components/common";
import { SignIn } from "@clerk/clerk-react";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated/signin")({
  beforeLoad: async ({ context }) => {
    const { isAuthenticated, isLoading } = await context.auth;
    if (!isLoading && isAuthenticated) throw redirect({ to: "/" });
  },
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <div className="flex flex-col w-96 max-w-full mx-auto min-h-dvh items-center justify-center gap-8 px-4 py-12">
      <Link href="https://namesake.fyi" className="mb-4">
        <Logo />
      </Link>
      <SignIn />
      <div className="flex gap-4 justify-center text-sm">
        <Link href="https://github.com/namesakefyi/namesake/releases">{`v${APP_VERSION}`}</Link>
        <Link href="https://namesake.fyi/chat">Support</Link>
        <Link href="https://status.namesake.fyi">Status</Link>
      </div>
    </div>
  );
}
