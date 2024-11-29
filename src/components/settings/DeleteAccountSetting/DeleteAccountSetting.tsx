import { Button, Modal, ModalHeader } from "@/components/common";
import { SettingsItem } from "@/components/settings";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { Trash } from "lucide-react";
import { useState } from "react";

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
  const { signOut } = useAuthActions();

  const clearLocalStorage = () => {
    localStorage.removeItem("theme");
  };
  const deleteAccount = useMutation(api.users.deleteCurrentUser);

  const handleSubmit = () => {
    clearLocalStorage();
    deleteAccount();
    signOut();
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader title="Delete account?" />
      <p>This will permanently erase your account and all data.</p>
      <div className="flex justify-end w-full gap-2">
        <Button onPress={() => onOpenChange(false)}>Cancel</Button>
        <Button variant="destructive" onPress={handleSubmit}>
          Delete
        </Button>
      </div>
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
