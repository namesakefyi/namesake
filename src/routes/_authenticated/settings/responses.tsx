import { PageHeader } from "@/components/app";
import { Badge } from "@/components/common";
import { FormResponsesList } from "@/components/settings";
import { api } from "@convex/_generated/api";
import {
  USER_FORM_DATA_FIELDS,
  type UserFormDataField,
} from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { ShieldCheck } from "lucide-react";
export const Route = createFileRoute("/_authenticated/settings/responses")({
  component: FormResponsesRoute,
});

const getReadableFieldLabel = (field: UserFormDataField | string) => {
  try {
    return USER_FORM_DATA_FIELDS[field as UserFormDataField];
  } catch (error) {
    console.error(error);
    return field;
  }
};

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
