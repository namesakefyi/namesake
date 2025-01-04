import { AppContent } from "@/components/app";
import { Button } from "@/components/common";
import { FormPage } from "@/components/forms";
import { QuestPageHeader } from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute(
  "/_authenticated/_home/quests/$questId/form",
)({
  component: QuestFormRoute,
});

function QuestFormRoute() {
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

  if (!pages) return null;

  const handleSubmit = async () => {
    console.log("Submit");
  };

  return (
    <AppContent>
      <QuestPageHeader quest={quest} />
      <div className="flex flex-col gap-4">
        {pages.map((page) => (
          <FormPage key={page._id} page={page} />
        ))}
      </div>
      <footer className="flex justify-end py-6 gap-4">
        <Button variant="primary" size="large" onPress={handleSubmit}>
          Submit
        </Button>
      </footer>
    </AppContent>
  );
}
