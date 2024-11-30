import {
  Banner,
  Button,
  Form,
  Modal,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@/components/common";
import { SettingsItem } from "@/components/settings";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { JURISDICTIONS, type Jurisdiction } from "@convex/constants";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type EditBirthplaceModalProps = {
  defaultBirthplace: Jurisdiction;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
};

const EditBirthplaceModal = ({
  defaultBirthplace,
  isOpen,
  onOpenChange,
  onSubmit,
}: EditBirthplaceModalProps) => {
  const [birthplace, setBirthplace] = useState<Jurisdiction>(defaultBirthplace);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateBirthplace = useMutation(api.users.setBirthplace);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!birthplace) {
      setError("Please select a state.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateBirthplace({ birthplace });
      onSubmit();
      toast.success("Birthplace updated.");
    } catch (err) {
      setError("Failed to update birthplace. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader
        title="Edit birthplace"
        description="Where were you born? This location is used to select the forms for your birth certificate."
      />
      <Form onSubmit={handleSubmit} className="w-full">
        {error && <Banner variant="danger">{error}</Banner>}
        <Select
          label="State"
          name="birthplace"
          selectedKey={birthplace}
          onSelectionChange={(key) => {
            setBirthplace(key as Jurisdiction);
            setError(undefined);
          }}
          isRequired
          className="w-full"
          placeholder="Select state"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <ModalFooter>
          <Button
            variant="secondary"
            onPress={() => onOpenChange(false)}
            isDisabled={isSubmitting}
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

type EditBirthplaceSettingProps = {
  user: Doc<"users">;
};

export const EditBirthplaceSetting = ({ user }: EditBirthplaceSettingProps) => {
  const [isBirthplaceModalOpen, setIsBirthplaceModalOpen] = useState(false);

  return (
    <SettingsItem
      label="Birthplace"
      description="Where were you born? This location is used to select the forms for your birth certificate."
    >
      <Button icon={Pencil} onPress={() => setIsBirthplaceModalOpen(true)}>
        {user?.birthplace
          ? JURISDICTIONS[user.birthplace as Jurisdiction]
          : "Set birthplace"}
      </Button>
      <EditBirthplaceModal
        defaultBirthplace={user.birthplace as Jurisdiction}
        isOpen={isBirthplaceModalOpen}
        onOpenChange={setIsBirthplaceModalOpen}
        onSubmit={() => setIsBirthplaceModalOpen(false)}
      />
    </SettingsItem>
  );
};
