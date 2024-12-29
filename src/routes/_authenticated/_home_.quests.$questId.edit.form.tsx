import { AppContent } from "@/components/app";
import { Badge, Button, Container, Empty, Link } from "@/components/common";
import { EditableFormPage, EditableFormSidebar } from "@/components/forms";
import { QuestPageHeader } from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Plus, TextCursorInput } from "lucide-react";
import { z } from "zod";

const formEditSearchSchema = z.strictObject({
  field: z.string().optional(),
});

export const Route = createFileRoute(
  "/_authenticated/_home_/quests/$questId/edit/form",
)({
  component: QuestEditFormRouteComponent,
  validateSearch: (search) => formEditSearchSchema.parse(search),
});

function QuestEditFormRouteComponent() {
  const { questId } = Route.useParams();
  const { field: fieldId } = Route.useSearch();

  const selectedField = useQuery(api.formFields.getById, {
    fieldId: fieldId as Id<"formFields">,
  });
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
          <div className="flex flex-col gap-4">
            {pages &&
              pages.length > 0 &&
              pages.map((page) => (
                <EditableFormPage key={page._id} pageId={page._id} />
              ))}
            <Button
              icon={Plus}
              onPress={() => createPage({ formId: form._id, title: "" })}
              size="large"
            >
              Add page
            </Button>
          </div>
        </AppContent>
      </Container>
      <EditableFormSidebar field={selectedField} />
    </div>
  );
}
