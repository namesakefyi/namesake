import {
  Badge,
  Button,
  Card,
  Form,
  PageHeader,
  RichTextEditor,
  TextField,
} from "@/components";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { ICONS } from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import Markdown from "react-markdown";

export const Route = createFileRoute("/_authenticated/admin/quests/$questId")({
  component: AdminQuestDetailRoute,
});

function AdminQuestDetailRoute() {
  const { questId } = Route.useParams();
  const quest = useQuery(api.quests.getQuest, {
    questId: questId as Id<"quests">,
  });
  const steps = useQuery(api.questSteps.getStepsForQuest, {
    questId: questId as Id<"quests">,
  });
  const addQuestStep = useMutation(api.questSteps.create);
  const [isNewStepFormVisible, setIsNewStepFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // TODO: Loading and empty states
  if (quest === undefined) return;
  if (quest === null) return "Form not found";

  const clearForm = () => {
    setTitle("");
    setDescription("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addQuestStep({
      questId: questId as Id<"quests">,
      title,
      description,
    });
    clearForm();
    setIsNewStepFormVisible(false);
  };

  return (
    <div>
      <PageHeader
        icon={quest.icon ? ICONS[quest.icon] : undefined}
        title={quest.title}
        badge={<Badge size="lg">{quest.jurisdiction}</Badge>}
      />
      <div className="flex flex-col gap-6">
        {steps ? (
          <ol className="flex flex-col gap-4">
            {steps.map(
              (step, i) =>
                step && (
                  <li key={`${quest.title}-step-${i}`}>
                    <Card className="flex flex-col gap-2">
                      <h2 className="text-xl font-semibold">{step.title}</h2>
                      {step.description && (
                        <div>
                          <Markdown className="prose dark:prose-invert">
                            {step.description}
                          </Markdown>
                        </div>
                      )}
                    </Card>
                  </li>
                ),
            )}
          </ol>
        ) : (
          "No steps"
        )}

        {!isNewStepFormVisible ? (
          <Button onPress={() => setIsNewStepFormVisible(true)}>
            Add step
          </Button>
        ) : (
          <Card>
            <Form onSubmit={handleSubmit}>
              <h2 className="text-lg">New step</h2>
              <TextField
                label="Title"
                value={title}
                onChange={setTitle}
                description="Use sentence case and no punctuation"
              />
              <RichTextEditor
                markdown={description}
                onChange={setDescription}
              />

              <div className="flex gap-2 justify-end">
                <Button onPress={() => setIsNewStepFormVisible(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </div>
            </Form>
          </Card>
        )}
      </div>
    </div>
  );
}
