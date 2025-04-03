import { PageHeader } from "@/components/app";
import { Badge } from "@/components/common";
import {
  FormResponsesList,
  getReadableFieldLabel,
} from "@/components/settings";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings/responses")({
  component: FormResponsesRoute,
});

function FormResponsesRoute() {
  const userData = useQuery(api.userFormResponses.list);
  const rows = userData?.map((data) => ({
    id: data._id,
    field: getReadableFieldLabel(data.field),
    value: data.value,
  }));

  return (
    <>
      <PageHeader
        title="Form Responses"
        mobileBackLink={{ to: "/settings" }}
        badge={
          <Badge variant="success" icon={ShieldCheck}>
            Encrypted
          </Badge>
        }
      />
      <FormResponsesList rows={rows} />
    </>
  );
}
