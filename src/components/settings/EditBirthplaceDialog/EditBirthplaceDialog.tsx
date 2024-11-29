import { Button, Form, Modal, Select, SelectItem } from "@/components/common";
import { api } from "@convex/_generated/api";
import { JURISDICTIONS, type Jurisdiction } from "@convex/constants";
import { useMutation } from "convex/react";
import { useState } from "react";

type EditBirthplaceDialogProps = {
  defaultBirthplace: Jurisdiction;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
};

export const EditBirthplaceDialog = ({
  defaultBirthplace,
  isOpen,
  onOpenChange,
  onSubmit,
}: EditBirthplaceDialogProps) => {
  const updateBirthplace = useMutation(api.users.setBirthplace);
  const [birthplace, setBirthplace] = useState(defaultBirthplace);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateBirthplace({ birthplace });
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form onSubmit={handleSubmit} className="w-full">
        Edit birthplace
        <Select
          aria-label="Birthplace"
          name="birthplace"
          selectedKey={birthplace}
          onSelectionChange={(key) => setBirthplace(key as Jurisdiction)}
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
