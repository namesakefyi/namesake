import type { Doc } from "@convex/_generated/dataModel";
import Markdown from "react-markdown";
import { Card } from "../Card";
import { Checkbox } from "../Checkbox";
import { DateField } from "../DateField";
import { NumberField } from "../NumberField";
import { Select, SelectItem } from "../Select";
import { TextArea } from "../TextArea";
import { TextField } from "../TextField";

export interface QuestStepProps {
  title: string;
  description?: string;
  fields?: Doc<"questFields">[];
}

export function QuestFields(props: { questFields: Doc<"questFields">[] }) {
  const markupForField = (field: Doc<"questFields">) => {
    switch (field.type) {
      case "text":
        return (
          <TextField
            label={field.label}
            description={field.helpText}
            type="text"
          />
        );
      case "email":
        return (
          <TextField
            label={field.label}
            description={field.helpText}
            type="email"
          />
        );
      case "phone":
        return (
          <TextField
            label={field.label}
            description={field.helpText}
            type="tel"
          />
        );
      case "textarea":
        return <TextArea label={field.label} description={field.helpText} />;
      case "number":
        return <NumberField label={field.label} description={field.helpText} />;
      case "select":
        return (
          <Select label={field.label} description={field.helpText}>
            {/* TODO: Add select options */}
            <SelectItem />
          </Select>
        );
      case "checkbox":
        return <Checkbox label={field.label} description={field.helpText} />;
      case "date":
        return <DateField label={field.label} description={field.helpText} />;
      default:
        return undefined;
    }
  };

  // TODO: Add skeleton loaders
  return props.questFields.map((field) => (
    <div key={field._id}>{markupForField(field)}</div>
  ));
}

export function QuestStep({ title, description, fields }: QuestStepProps) {
  return (
    <Card className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && (
        <div>
          <Markdown className="prose dark:prose-invert">{description}</Markdown>
        </div>
      )}
      {fields && <QuestFields questFields={fields} />}
    </Card>
  );
}
