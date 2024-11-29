import { Button, Form, Modal, Select, SelectItem } from "@/components/common";
import { api } from "@convex/_generated/api";
import { JURISDICTIONS, type Jurisdiction } from "@convex/constants";
import { useMutation } from "convex/react";
import { useState } from "react";

type EditResidenceDialogProps = {
  defaultResidence: Jurisdiction;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
};

export const EditResidenceDialog = ({
  defaultResidence,
  isOpen,
  onOpenChange,
  onSubmit,
}: EditResidenceDialogProps) => {
  const updateResidence = useMutation(api.users.setResidence);
  const [residence, setResidence] = useState(defaultResidence);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateResidence({ residence });
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form onSubmit={handleSubmit} className="w-full">
        Edit residence
        <Select
          aria-label="Residence"
          name="residence"
          selectedKey={residence}
          onSelectionChange={(key) => setResidence(key as Jurisdiction)}
          placeholder="Select state"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
