import {
  Button,
  Form,
  Modal,
  ModalHeader,
  Select,
  SelectItem,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import {
  CATEGORIES,
  type Category,
  JURISDICTIONS,
  type Jurisdiction,
} from "@convex/constants";
import { useMutation } from "convex/react";
import { CircleHelp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type EditQuestBasicsModalProps = {
  quest: Doc<"quests">;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const EditQuestBasicsModal = ({
  quest,
  open,
  onOpenChange,
}: EditQuestBasicsModalProps) => {
  const [input, setInput] = useState<{
    title: string;
    category: Category | null;
    jurisdiction: Jurisdiction | null;
  }>({
    title: quest.title ?? "",
    category: quest.category as Category,
    jurisdiction: quest.jurisdiction as Jurisdiction,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!quest) {
    return null;
  }

  const setAll = useMutation(api.quests.setAll);

  const handleCancel = () => {
    setInput({
      title: quest.title ?? null,
      category: quest.category as Category,
      jurisdiction: quest.jurisdiction as Jurisdiction,
    });
    onOpenChange(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setAll({
      title: input.title,
      category: input.category ?? undefined,
      jurisdiction: input.jurisdiction ?? undefined,
      questId: quest._id,
    })
      .then(() => {
        toast.success("Updated quest");
        onOpenChange(false);
      })
      .catch(() => {
        toast.error("Failed to update quest");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Modal isOpen={open}>
      <Form onSubmit={handleSubmit} className="w-full">
        <ModalHeader title="Edit quest details" />
        <Select
          label="Category"
          name="category"
          selectedKey={input.category}
          onSelectionChange={(value) =>
            setInput({ ...input, category: value as Category })
          }
          placeholder="Select a category"
          isRequired
        >
          {Object.entries(CATEGORIES).map(([key, { label, icon }]) => {
            const Icon = icon ?? CircleHelp;
            return (
              <SelectItem key={key} id={key} textValue={key}>
                <Icon size={16} /> {label}
              </SelectItem>
            );
          })}
        </Select>
        <TextField
          label="Title"
          name="title"
          isRequired
          value={input.title}
          onChange={(value) => setInput({ ...input, title: value })}
          className="w-full"
        />
        <Select
          label="State"
          name="jurisdiction"
          selectedKey={input.jurisdiction}
          onSelectionChange={(key) =>
            setInput({ ...input, jurisdiction: key as Jurisdiction })
          }
          placeholder="Select a state"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onPress={handleCancel}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isDisabled={isSubmitting}>
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
