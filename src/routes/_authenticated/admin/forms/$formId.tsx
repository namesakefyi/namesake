import { Badge, PageHeader } from "@/components";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_authenticated/admin/forms/$formId")({
  component: AdminFormDetailRoute,
});

function AdminFormDetailRoute() {
  const { formId } = Route.useParams();
  const form = useQuery(api.forms.getForm, {
    formId: formId as Id<"forms">,
  });
  const fileUrl = useQuery(api.forms.getFormPDFUrl, {
    formId: formId as Id<"forms">,
  });

  if (form === undefined) return;
  if (form === null) return "Form not found";

  return (
    <div>
      <PageHeader
        title={form.title}
        badge={<Badge size="lg">{form.jurisdiction}</Badge>}
        subtitle={form.formCode}
      />
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
