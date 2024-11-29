import {
  Button,
  Form,
  Modal,
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

type EditResidenceModalProps = {
  defaultResidence: Jurisdiction;
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
  const updateResidence = useMutation(api.users.setResidence);
  const [residence, setResidence] = useState(defaultResidence);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateResidence({ residence });
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader title="Edit residence" />
      <Form onSubmit={handleSubmit} className="w-full">
        <Select
          aria-label="Residence"
          name="residence"
          selectedKey={residence}
          onSelectionChange={(key) => setResidence(key as Jurisdiction)}
          placeholder="Select state"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
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
