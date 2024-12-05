import { PageHeader } from "@/components/app";
import { Badge, Button, Link } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useAction, useQuery } from "convex/react";

export const Route = createFileRoute("/_authenticated/admin/forms/$formId")({
  component: AdminFormDetailRoute,
});

function AdminFormDetailRoute() {
  const { formId } = Route.useParams();
  const form = useQuery(api.forms.getById, {
    formId: formId as Id<"forms">,
  });
  const fileUrl = useQuery(api.forms.getURL, {
    formId: formId as Id<"forms">,
  });
  const parseForm = useAction(api.parseForm.parse);

  if (form === undefined) return;
  if (form === null) return "Form not found";

  const handleParseForm = () => {
    parseForm({ formId: formId as Id<"forms"> });
  };

  return (
    <div>
      <PageHeader
        title={form.title}
        badge={
          <>
            <Badge size="lg">{form.jurisdiction}</Badge>
            <Badge size="lg">{form.formCode}</Badge>
          </>
        }
      >
        <Button onPress={handleParseForm}>Parse Form</Button>
        <Link
          href={{
            to: "/admin/quests/$questId",
            params: { questId: form.questId },
          }}
          button={{ variant: "secondary" }}
        >
          Go to quest
        </Link>
      </PageHeader>
      {fileUrl && (
        <object
          className="w-full aspect-square max-h-full rounded-lg"
          data={fileUrl}
          title={form.title}
        />
      )}
    </div>
  );
}
