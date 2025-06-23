import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Form,
  Modal,
  ModalHeader,
  TextField,
} from "@/components/common";

type EditQuestTitleModalProps = {
  quest: Doc<"quests">;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const EditQuestTitleModal = ({
  quest,
  open,
  onOpenChange,
}: EditQuestTitleModalProps) => {
  const [title, setTitle] = useState(quest.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateTitle = useMutation(api.quests.setTitle);

  const handleCancel = () => {
    setTitle(quest.title);
    onOpenChange(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      updateTitle({ questId: quest._id, title });
      toast.success("Updated title");
      onOpenChange(false);
    } catch (_error) {
      toast.error("Failed to update title");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={open}>
      <Form onSubmit={handleSubmit} className="w-full">
        <ModalHeader title="Edit title" />
        <TextField label="Title" value={title} onChange={setTitle} />
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
