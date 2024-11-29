import { Button, Form, Modal, TextField } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { SettingsItem } from "../SettingsItem";

type EditNameModalProps = {
  defaultName: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
};

const EditNameModal = ({
  defaultName,
  isOpen,
  onOpenChange,
  onSubmit,
}: EditNameModalProps) => {
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

type EditNameSettingProps = {
  user: Doc<"users">;
};

export const EditNameSetting = ({ user }: EditNameSettingProps) => {
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  return (
    <SettingsItem
      label="Name"
      description="How should Namesake refer to you? This can be different from your legal name."
    >
      <Button icon={Pencil} onPress={() => setIsNameModalOpen(true)}>
        {user?.name ?? "Set name"}
      </Button>
      <EditNameModal
        isOpen={isNameModalOpen}
        onOpenChange={setIsNameModalOpen}
        defaultName={user.name ?? ""}
        onSubmit={() => setIsNameModalOpen(false)}
      />
    </SettingsItem>
  );
};
