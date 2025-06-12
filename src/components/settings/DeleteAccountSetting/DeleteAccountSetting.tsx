import {
  Banner,
  Button,
  Form,
  Modal,
  ModalFooter,
  ModalHeader,
  TextField,
} from "@/components/common";
import { SettingsItem } from "@/components/settings";
import { api } from "@convex/_generated/api";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Trash } from "lucide-react";
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
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const [isDeleting, setIsDeleting] = useState(false);

  const clearLocalStorage = () => {
    localStorage.removeItem("theme");
  };
  const deleteAccount = useMutation(api.users.deleteCurrentUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (value !== "DELETE") {
      setError("Please type DELETE to confirm.");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteAccount();
      clearLocalStorage();
      onSubmit();
      navigate({ to: "/signout" });
      toast.success("Account deleted.");
    } catch (err) {
      setError("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader
        title="Delete account?"
        description="This will permanently erase your account and all data."
      />
      <Form onSubmit={handleSubmit} className="w-full">
        {error ? (
          <Banner variant="danger">{error}</Banner>
        ) : (
          <Banner variant="warning">This action cannot be undone.</Banner>
        )}
        <TextField
          label="Type DELETE to confirm"
          isRequired
          value={value}
          onChange={(value) => {
            setValue(value);
            setError(undefined);
          }}
          className="w-full"
          autoComplete="off"
        />
        <ModalFooter>
          <Button
            variant="secondary"
            onPress={() => onOpenChange(false)}
            isDisabled={isDeleting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="destructive" isDisabled={isDeleting}>
            Delete account
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
      description="Permanently delete your Namesake account."
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
