import {
  Banner,
  Button,
  Form,
  Modal,
  ModalFooter,
  ModalHeader,
} from "@/components/common";
import { SettingsItem } from "@/components/settings";
import { authClient } from "@/main";
import type { Doc } from "@convex/_generated/dataModel";
import { Trash } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { toast } from "sonner";

type DeleteAccountModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
  email?: string;
};

const DeleteAccountModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
  email,
}: DeleteAccountModalProps) => {
  const [error, setError] = useState<string>();
  const [isSending, setIsSending] = useState(false);
  const postHog = usePostHog();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setIsSending(true);

    const { error } = await authClient.deleteUser({
      callbackURL: "/goodbye",
    });

    if (error) {
      setError(error.message || "Something went wrong.");
      setIsSending(false);
      postHog.captureException(error);
      return;
    }

    onSubmit();
    toast.success("Check your email to finish deleting your account.");
    setIsSending(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader
        title="Delete account?"
        description={`A confirmation email will be sent to ${email || "your email address"}.`}
      />
      <Form onSubmit={handleSubmit} className="w-full">
        {error ? (
          <Banner variant="danger">{error}</Banner>
        ) : (
          <Banner variant="warning">
            Once deleted, your account is gone forever.
          </Banner>
        )}
        <ModalFooter>
          <Button
            variant="secondary"
            onPress={() => onOpenChange(false)}
            isDisabled={isSending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="destructive" isSubmitting={isSending}>
            Send deletion email
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

type DeleteAccountSettingProps = {
  user: Doc<"users">;
};

export const DeleteAccountSetting = ({ user }: DeleteAccountSettingProps) => {
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  return (
    <SettingsItem
      label="Delete account"
      description="Permanently delete your Namesake account and data."
    >
      <Button onPress={() => setIsDeleteAccountModalOpen(true)} icon={Trash}>
        Delete account
      </Button>
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onOpenChange={setIsDeleteAccountModalOpen}
        onSubmit={() => setIsDeleteAccountModalOpen(false)}
        email={user.email}
      />
    </SettingsItem>
  );
};
