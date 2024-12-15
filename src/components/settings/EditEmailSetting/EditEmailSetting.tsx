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

type EditEmailModalProps = {
  defaultEmail: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
};

const EditEmailModal = ({
  defaultEmail,
  isOpen,
  onOpenChange,
  onSubmit,
}: EditEmailModalProps) => {
  const updateEmail = useMutation(api.users.setEmail);
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    try {
      setIsSubmitting(true);
      await updateEmail({ email: email.trim() });
      onSubmit();
      toast.success("Email updated.");
    } catch (err) {
      setError("Failed to update email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader
        title="Email address"
        description="This is the email we’ll use to contact you."
      />
      <Form onSubmit={handleSubmit} className="w-full">
        {error && <Banner variant="danger">{error}</Banner>}
        <TextField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
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

type EditEmailSettingProps = {
  user: Doc<"users">;
};

export const EditEmailSetting = ({ user }: EditEmailSettingProps) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  return (
    <SettingsItem
      label="Email address"
      description="This is the email we’ll use to contact you."
    >
      <Button icon={Pencil} onPress={() => setIsEmailModalOpen(true)}>
        {user?.email ?? "Set email"}
      </Button>
      <EditEmailModal
        isOpen={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        defaultEmail={user.email ?? ""}
        onSubmit={() => setIsEmailModalOpen(false)}
      />
    </SettingsItem>
  );
};
