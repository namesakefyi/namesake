import {
  Button,
  Form,
  Modal,
  ModalHeader,
  Select,
  SelectItem,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { CATEGORIES, type Category } from "@convex/constants";
import { useMutation } from "convex/react";
import { CircleHelp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type EditQuestCategoryModalProps = {
  quest: Doc<"quests">;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const EditQuestCategoryModal = ({
  quest,
  open,
  onOpenChange,
}: EditQuestCategoryModalProps) => {
  const [category, setCategory] = useState(quest.category);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateCategory = useMutation(api.quests.setCategory);

  const handleCancel = () => {
    setCategory(quest.category);
    onOpenChange(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (category !== undefined) {
      try {
        setIsSubmitting(true);
        updateCategory({
          questId: quest._id,
          category: category as Category,
        });
        onOpenChange(false);
      } catch (error) {
        toast.error("Couldn't update state.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal isOpen={open}>
      <Form onSubmit={handleSubmit} className="w-full">
        <ModalHeader title="Edit category" />
        <Select
          label="Category"
          name="category"
          selectedKey={category}
          onSelectionChange={(key) => setCategory(key as Category)}
          placeholder="Select a category"
          className="flex-[0.5]"
        >
          {Object.entries(CATEGORIES).map(([key, { label, icon }]) => {
            const Icon = icon ?? CircleHelp;
            return (
              <SelectItem key={key} id={key} textValue={key}>
                <Icon size={20} /> {label}
              </SelectItem>
            );
          })}
        </Select>
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onPress={handleCancel}
            isSubmitting={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
