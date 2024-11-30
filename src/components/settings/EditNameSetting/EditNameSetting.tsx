import {
  Banner,
  Button,
  Form,
  Modal,
  ModalFooter,
  ModalHeader,
  TextField,
} from "@/components/common";
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
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.length > 100) {
      setError("Name must be less than 100 characters");
      return;
    }

    try {
      await updateName({ name: name.trim() });
      onSubmit();
    } catch (err) {
      setError("Failed to update name. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader title="Edit name" />
      <Form onSubmit={handleSubmit} className="w-full">
        {error && <Banner variant="danger">{error}</Banner>}
        <TextField
          name="name"
          label="Name"
          value={name}
          onChange={(value) => {
            setName(value);
            setError(undefined);
          }}
          className="w-full"
          isRequired
          description="What name should Namesake use to refer to you? This can be different from your legal name."
        />
        <ModalFooter>
          <Button variant="secondary" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </ModalFooter>
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
