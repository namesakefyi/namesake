import { AppContent } from "@/components/app";
import { Empty } from "@/components/common";
import { EditableFormPage } from "@/components/forms";
import { QuestPageHeader } from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Plus, TextCursorInput } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/_home/quests/$questId/edit/form",
)({
  component: RouteComponent,
});

function RouteComponent() {
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
  const createPage = useMutation(api.formPages.create);

  const handleFormCreation = async () => {
    const formId = await createForm({ questId: questId as Id<"quests"> });
    await createPage({ formId, title: "" });
  };

  if (form === undefined || quest === undefined) return null;
  if (form === null || quest === null)
    return (
      <Empty
        icon={TextCursorInput}
        title="No form for this quest"
        button={{
          children: "Create form",
          onPress: handleFormCreation,
        }}
      />
    );

  return (
    <AppContent>
      <QuestPageHeader quest={quest} />
      {pages && pages.length > 0 ? (
        pages.map((page) => (
          <EditableFormPage key={page._id} pageId={page._id} />
        ))
      ) : (
        <Empty
          icon={TextCursorInput}
          title="No Pages"
          button={{
            icon: Plus,
            children: "Add Page",
            onPress: () =>
              createPage({
                formId: form._id,
                title: "",
              }),
          }}
        />
      )}
    </AppContent>
  );
}
