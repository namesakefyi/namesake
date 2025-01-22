import { AppContent, PageHeader } from "@/components/app";
import { Badge, Link } from "@/components/common";
import { Step, Steps } from "@/components/quests";
import { JURISDICTIONS } from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_home/court-order/$jurisdiction",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { jurisdiction } = Route.useParams();

  const badge = (
    <Badge>
      {JURISDICTIONS[jurisdiction.toUpperCase() as keyof typeof JURISDICTIONS]}
    </Badge>
  );

  return (
    <AppContent>
      <PageHeader title="Court Order" badge={badge} />
      <Steps>
        <Step title="Get prepared">
          The court petition is a formal request to the state to legally change
          your name. You’ll file this by mail or directly with a clerk at the
          Probate and Family Court in your county. If approved, you’ll be mailed
          a certified Decree of Change of Name, which is the official and legal
          proof of your name.
        </Step>
        <Step title="Answer questions">
          We'll guide you through the necessary questions to file your name
          change.
          <Link
            href={{ to: "/forms/court-order/ma" }}
            button={{ size: "large" }}
          >
            Answer questions
          </Link>
        </Step>
        <Step title="Review and print documents">
          Make sure everything looks accurate and complete any missing fields.
          Hold off on signing the Court Petition until you’re in the presence of
          a notary. To file your name change, you’ll also need a certified copy
          of your birth certificate, and legal records of any previous name
          changes.
        </Step>
        <Step title="Gather funds">
          Massachusetts charges a $150 filing fee + $15 surcharge fee + $15
          citation fee = $180 total filing fee. You can waive court fees if you
          meet the eligibility requirements in Massachusetts.
        </Step>
        <Step title="File documents">
          You’ll file this by mail or directly with a clerk at the Probate and
          Family Court in your county. We suggest filing in person, if you can.
        </Step>
        <Step title="Await decision">
          Typically, decisions take 2-6 weeks to arrive by mail.
        </Step>
      </Steps>
    </AppContent>
  );
}
