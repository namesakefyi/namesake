import {
  Badge,
  Button,
  Card,
  Form,
  Menu,
  MenuItem,
  PageHeader,
  RichTextEditor,
  Select,
  SelectItem,
  TextField,
} from "@/components";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { FIELDS, ICONS } from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { MenuTrigger } from "react-aria-components";
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
  const allFields = useQuery(api.questFields.getAllFields);
  const addQuestStep = useMutation(api.questSteps.create);
  const [isNewStepFormVisible, setIsNewStepFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<Id<"questFields">[]>([]);

  // TODO: Loading and empty states
  if (quest === undefined) return;
  if (quest === null) return "Form not found";

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setFields([]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addQuestStep({
      questId: questId as Id<"quests">,
      title,
      description,
      fields,
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
                isRequired
              />
              <RichTextEditor
                markdown={description}
                onChange={setDescription}
              />
              {allFields &&
                fields.map((field, i) => (
                  <Card key={field} className="flex flex-col gap-4">
                    <Select
                      label="Field"
                      placeholder="Select a field"
                      selectedKey={field}
                      onSelectionChange={(key) => {
                        setFields(
                          fields.map((f, index) =>
                            index === i ? (key as Id<"questFields">) : f,
                          ),
                        );
                      }}
                    >
                      {allFields.map((field) => {
                        const Icon = FIELDS[field.type].icon;
                        return (
                          <SelectItem
                            key={field._id}
                            id={field._id}
                            textValue={field.label}
                          >
                            <Icon size={20} />
                            {field.label}
                          </SelectItem>
                        );
                      })}
                    </Select>
                    <Button
                      onPress={() =>
                        setFields(fields.filter((_, index) => index !== i))
                      }
                    >
                      Remove
                    </Button>
                  </Card>
                ))}
              {allFields && (
                <MenuTrigger>
                  <Button variant="secondary">Add field</Button>
                  <Menu>
                    {allFields.map((field) => {
                      const Icon = FIELDS[field.type].icon;
                      return (
                        <MenuItem
                          key={field._id}
                          textValue={field.label}
                          onAction={() => setFields([...fields, field._id])}
                        >
                          <Icon size={20} />
                          {field.label}
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </MenuTrigger>
              )}
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
