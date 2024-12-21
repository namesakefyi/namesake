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
import { DUPLICATE_EMAIL, INVALID_EMAIL } from "@convex/errors";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
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
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      await updateEmail({ email: email.trim() });
      onSubmit();
      toast.success("Email updated.");
    } catch (err) {
      if (err instanceof ConvexError) {
        if (err.data === INVALID_EMAIL) {
          setError("Please enter a valid email address.");
        } else if (err.data === DUPLICATE_EMAIL) {
          setError("This email is currently in use. Try another one.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } else {
        setError("Failed to update email. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader
        title="Email address"
        description="Your account email is used for sign-in and communication."
      />
      <Form onSubmit={handleSubmit} className="w-full">
        {error && <Banner variant="danger">{error}</Banner>}
        <TextField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(value) => setEmail(value)}
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
      label="Edit email address"
      description="What email would you like to use for Namesake?"
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
