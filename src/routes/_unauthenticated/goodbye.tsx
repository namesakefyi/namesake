import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "react-aria-components";
import { SignInWrapper } from "@/components/app";
import { Link } from "@/components/common";

export const Route = createFileRoute("/_unauthenticated/goodbye")({
  component: GoodbyeRoute,
});

function GoodbyeRoute() {
  return (
    <SignInWrapper className="flex flex-col gap-4">
      <Heading className="text-xl font-semibold">
        Your Namesake account and all data have been deleted.
      </Heading>
      <p>We hope Namesake was helpful for you!</p>
      <p>
        If you have any feedback for how we can improve, please send us an
        email:
      </p>
      <Link href="mailto:hey@namesake.fyi" button={{ variant: "secondary" }}>
        hey@namesake.fyi
      </Link>
    </SignInWrapper>
  );
}
