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

type EditResidenceModalProps = {
  defaultResidence: Jurisdiction | undefined;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
};

const EditResidenceModal = ({
  defaultResidence,
  isOpen,
  onOpenChange,
  onSubmit,
}: EditResidenceModalProps) => {
  const [residence, setResidence] = useState<Jurisdiction | undefined>(
    defaultResidence,
  );
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateResidence = useMutation(api.users.setResidence);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!residence) {
      setError("Please select a state.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateResidence({ residence });
      onSubmit();
      toast.success("Residence updated.");
    } catch (err) {
      setError("Failed to update residence. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader
        title="Edit residence"
        description="Where do you live? This location is used to select the forms for your court order and state ID."
      />
      <Form onSubmit={handleSubmit} className="w-full">
        {error && <Banner variant="danger">{error}</Banner>}
        <Select
          label="State"
          name="residence"
          selectedKey={residence}
          onSelectionChange={(key) => {
            setResidence(key as Jurisdiction);
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

type EditResidenceSettingProps = {
  user: Doc<"users">;
};

export const EditResidenceSetting = ({ user }: EditResidenceSettingProps) => {
  const [isResidenceModalOpen, setIsResidenceModalOpen] = useState(false);

  return (
    <SettingsItem
      label="Residence"
      description="Where do you live? This location is used to select the forms for your court order and state ID."
    >
      <Button icon={Pencil} onPress={() => setIsResidenceModalOpen(true)}>
        {user?.residence
          ? JURISDICTIONS[user.residence as Jurisdiction]
          : "Set residence"}
      </Button>
      <EditResidenceModal
        isOpen={isResidenceModalOpen}
        onOpenChange={setIsResidenceModalOpen}
        defaultResidence={user.residence as Jurisdiction}
        onSubmit={() => setIsResidenceModalOpen(false)}
      />
    </SettingsItem>
  );
};
