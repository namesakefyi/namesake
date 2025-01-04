import { AppContent } from "@/components/app";
import { Badge, Container, Empty, Link } from "@/components/common";
import { EditFormSidebar, FormPage } from "@/components/forms";
import { QuestPageHeader } from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { TextCursorInput } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/_home_/quests/$questId/edit/form",
)({
  component: QuestEditFormRouteComponent,
});

function QuestEditFormRouteComponent() {
  const { questId } = Route.useParams();

  const quest = useQuery(api.quests.getById, {
    questId: questId as Id<"quests">,
  });
  const form = useQuery(api.forms.getByQuestId, {
    questId: questId as Id<"quests">,
  });
  const pages = useQuery(api.formPages.getAllByFormId, {
    formId: form?._id,
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
    <div className="flex">
      <Container className="flex-1 flex flex-col gap-4 pb-8">
        <AppContent>
          <QuestPageHeader
            quest={quest}
            badge={<Badge variant="warning">Editing form</Badge>}
          >
            <Link
              button={{ variant: "secondary" }}
              href={{ to: "/quests/$questId/edit" }}
            >
              Done
            </Link>
          </QuestPageHeader>
          <div className="flex flex-col gap-6">
            {pages?.map((page) => (
              <FormPage key={page._id} page={page} />
            ))}
          </div>
        </AppContent>
      </Container>
      <EditFormSidebar form={form} />
    </div>
  );
}
