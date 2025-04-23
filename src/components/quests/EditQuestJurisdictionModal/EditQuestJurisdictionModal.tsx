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
import { JURISDICTIONS, type Jurisdiction } from "@convex/constants";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

type EditQuestJurisdictionModalProps = {
  quest: Doc<"quests">;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const EditQuestJurisdictionModal = ({
  quest,
  open,
  onOpenChange,
}: EditQuestJurisdictionModalProps) => {
  const [jurisdiction, setJurisdiction] = useState(quest.jurisdiction);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateJurisdiction = useMutation(api.quests.setJurisdiction);

  const handleCancel = () => {
    setJurisdiction(quest.jurisdiction);
    onOpenChange(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (jurisdiction !== undefined) {
      try {
        setIsSubmitting(true);
        updateJurisdiction({
          questId: quest._id,
          jurisdiction: jurisdiction as Jurisdiction,
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
        <ModalHeader title="Edit state" />
        <Select
          label="State"
          name="jurisdiction"
          selectedKey={jurisdiction}
          onSelectionChange={(key) => setJurisdiction(key as Jurisdiction)}
          placeholder="Select a state"
          className="flex-[0.5]"
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
