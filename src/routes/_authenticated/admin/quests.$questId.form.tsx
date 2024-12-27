import { PageHeader } from "@/components/app";
import { Empty } from "@/components/common";
import { FormPage } from "@/components/forms";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Plus, TextCursorInput } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/admin/quests/$questId/form",
)({
  component: AdminFormDetailRoute,
});

function AdminFormDetailRoute() {
  const { questId } = Route.useParams();
  const quest = useQuery(api.quests.getById, {
    questId: questId as Id<"quests">,
  });
  const form = useQuery(api.forms.getByQuestId, {
    questId: questId as Id<"quests">,
  });
  const pages = useQuery(api.formPages.getAllByQuestId, {
    questId: questId as Id<"quests">,
  });

  const createForm = useMutation(api.forms.create);

  if (form === undefined) return null;
  if (form === null)
    return (
      <Empty
        icon={TextCursorInput}
        title="No form for this quest"
        button={{
          children: "Create form",
          onPress: () => createForm({ questId: questId as Id<"quests"> }),
        }}
      />
    );

  return (
    <>
      <PageHeader title={quest?.title || "Loading..."} />
      <div className="mt-6">
        {pages && pages.length > 0 ? (
          pages.map((page) => (
            <FormPage
              key={page._id}
              title={page.title}
              description={page.description}
            />
          ))
        ) : (
          <Empty
            icon={TextCursorInput}
            title="No Pages"
            button={{
              icon: Plus,
              children: "Add Page",
            }}
          />
        )}
      </div>
    </>
  );
}
