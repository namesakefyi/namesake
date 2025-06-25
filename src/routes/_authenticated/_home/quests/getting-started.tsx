import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Snail } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app";
import { Banner, Link } from "@/components/common";
import {
  HowToChangeNames,
  QuestCallToAction,
  StatusSelect,
} from "@/components/quests";
import type { Status } from "@/constants";

export const Route = createFileRoute(
  "/_authenticated/_home/quests/getting-started",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const gettingStarted = useQuery(api.userGettingStarted.get);
  const updateGettingStartedStatus = useMutation(
    api.userGettingStarted.setStatus,
  );

  const handleStatusChange = async (status: Status) => {
    try {
      await updateGettingStartedStatus({ status });
    } catch (_err) {
      toast.error("Couldn't update status. Please try again.");
    }
  };

  return (
    <>
      <PageHeader title="Getting Started" mobileBackLink={{ to: "/" }}>
        <StatusSelect
          status={gettingStarted?.status as Status}
          onChange={handleStatusChange}
        />
      </PageHeader>
      <Banner icon={Snail} size="large" className="mb-6 mt-1">
        <strong>Welcome to Namesake!</strong> We're glad you're here. For help
        with the process or to share how things are going, come join us on{" "}
        <Link href="https:/namesake.fyi/chat" target="_blank">
          Discord
        </Link>{" "}
        or <Link href="mailto:hey@namesake.fyi">email us</Link>.
      </Banner>
      <HowToChangeNames />
      <QuestCallToAction
        data={{ gettingStarted }}
        illustration="birthCertificate"
        onChangeStatus={handleStatusChange}
        className="mt-4 mb-8"
        isLoading={gettingStarted === undefined}
      />
    </>
  );
}
