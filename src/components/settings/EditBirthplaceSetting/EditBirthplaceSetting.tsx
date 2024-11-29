import { Button, Form, Modal, Select, SelectItem } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { JURISDICTIONS, type Jurisdiction } from "@convex/constants";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { SettingsItem } from "../SettingsItem";

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
  const updateBirthplace = useMutation(api.users.setBirthplace);
  const [birthplace, setBirthplace] = useState(defaultBirthplace);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateBirthplace({ birthplace });
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form onSubmit={handleSubmit} className="w-full">
        Edit birthplace
        <Select
          aria-label="Birthplace"
          name="birthplace"
          selectedKey={birthplace}
          onSelectionChange={(key) => setBirthplace(key as Jurisdiction)}
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
        isOpen={isBirthplaceModalOpen}
        onOpenChange={setIsBirthplaceModalOpen}
        defaultBirthplace={user.birthplace as Jurisdiction}
        onSubmit={() => setIsBirthplaceModalOpen(false)}
      />
    </SettingsItem>
  );
};
