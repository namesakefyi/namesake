import { Button, Form, Modal, TextField } from "@/components/common";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";

type EditNameDialogProps = {
  defaultName: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
};

export const EditNameDialog = ({
  defaultName,
  isOpen,
  onOpenChange,
  onSubmit,
}: EditNameDialogProps) => {
  const updateName = useMutation(api.users.setName);
  const [name, setName] = useState(defaultName);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateName({ name });
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form onSubmit={handleSubmit} className="w-full">
        Edit name
        <TextField name="name" label="Name" value={name} onChange={setName} />
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
