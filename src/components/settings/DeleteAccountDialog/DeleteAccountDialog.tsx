import { Button, Modal, ModalHeader } from "@/components/common";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";

type DeleteAccountDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
};

export const DeleteAccountDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: DeleteAccountDialogProps) => {
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
