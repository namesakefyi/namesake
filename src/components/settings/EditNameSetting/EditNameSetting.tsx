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
import { toast } from "sonner";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (name.length > 100) {
      setError("Name must be less than 100 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateName({ name: name.trim() });
      onSubmit();
      toast.success("Name updated.");
    } catch (err) {
      setError("Failed to update name. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader
        title="Edit name"
        description="How should Namesake refer to you? This can be different from your legal name."
      />
      <Form onSubmit={handleSubmit} className="w-full">
        {error && <Banner variant="danger">{error}</Banner>}
        <TextField
          label="Name"
          name="name"
          value={name}
          onChange={(value) => {
            setName(value);
            setError(undefined);
          }}
          className="w-full"
          isRequired
        />
        <ModalFooter>
          <Button
            variant="secondary"
            isDisabled={isSubmitting}
            onPress={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isDisabled={isSubmitting}>
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
    <SettingsItem label="Name" description="How should Namesake refer to you?">
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
