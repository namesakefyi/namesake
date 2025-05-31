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
import { Trash } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { toast } from "sonner";

type DeleteAccountModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
};

const DeleteAccountModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: DeleteAccountModalProps) => {
  const [error, setError] = useState<string>();
  const [isDeleting, setIsDeleting] = useState(false);
  const postHog = usePostHog();

  const clearLocalStorage = () => {
    localStorage.removeItem("theme");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    setIsDeleting(true);
    const { error } = await authClient.deleteUser({
      callbackURL: "/goodbye",
    });
    if (error) {
      setError(error.message || "Something went wrong.");
      postHog.captureException(error);
      return;
    }
    toast.success("Check your email to finish deleting your account.");
    clearLocalStorage();
    onSubmit();
    setIsDeleting(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader
        title="Delete account?"
        description="A confirmation email will be sent to your email address."
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
            isDisabled={isDeleting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="destructive" isDisabled={isDeleting}>
            Send deletion email
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export const DeleteAccountSetting = () => {
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
      />
    </SettingsItem>
  );
};
