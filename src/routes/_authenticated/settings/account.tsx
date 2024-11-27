import {
  Button,
  Card,
  Form,
  Modal,
  PageHeader,
  Select,
  SelectItem,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@/components";
import { useTheme } from "@/utils/useTheme";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { JURISDICTIONS, type Jurisdiction, THEMES } from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { Header } from "react-aria-components";

export const Route = createFileRoute("/_authenticated/settings/account")({
  component: SettingsAccountRoute,
});

const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-4 mb-8 last-of-type:mb-0">
    <h2 className="text-lg font-medium">{title}</h2>
    <Card className="flex flex-col p-0 divide-y divide-gray-dim">
      {children}
    </Card>
  </section>
);

const SettingsItem = ({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="flex justify-between items-center gap-8 p-4">
    <div className="self-start">
      <h3 className="text-base -mt-px">{label}</h3>
      {description && (
        <p className="text-xs text-gray-dim text-balance mt-0.5">
          {description}
        </p>
      )}
    </div>
    <div>{children}</div>
  </div>
);

const EditNameDialog = ({
  defaultName,
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  defaultName: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) => {
  const updateName = useMutation(api.users.setName);
  const [name, setName] = useState(defaultName);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateName({ name });
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form onSubmit={handleSubmit} className="w-full">
        Edit name
        <TextField name="name" label="Name" value={name} onChange={setName} />
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

const EditResidenceDialog = ({
  defaultResidence,
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  defaultResidence: Jurisdiction;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) => {
  const updateResidence = useMutation(api.users.setResidence);
  const [residence, setResidence] = useState(defaultResidence);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateResidence({ residence });
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form onSubmit={handleSubmit} className="w-full">
        Edit residence
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

const EditBirthplaceDialog = ({
  defaultBirthplace,
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  defaultBirthplace: Jurisdiction;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) => {
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

const DeleteAccountDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) => {
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
      <Header>Delete account?</Header>
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

function SettingsAccountRoute() {
  const user = useQuery(api.users.getCurrentUser);
  const { themeSelection, setTheme } = useTheme();

  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);
  const [isResidenceDialogOpen, setIsResidenceDialogOpen] = useState(false);
  const [isBirthplaceDialogOpen, setIsBirthplaceDialogOpen] = useState(false);
  const updateIsMinor = useMutation(api.users.setCurrentUserIsMinor);

  return (
    <>
      <PageHeader title="Account" />
      {user === undefined ? (
        "Loading..."
      ) : user === null ? (
        "User not found, please reload"
      ) : (
        <>
          <SettingsSection title="Personal Information">
            <SettingsItem
              label="Name"
              description="How should Namesake refer to you? This can be different from your legal name."
            >
              <Button icon={Pencil} onPress={() => setIsNameDialogOpen(true)}>
                {user?.name ?? "Set name"}
              </Button>
              <EditNameDialog
                isOpen={isNameDialogOpen}
                onOpenChange={setIsNameDialogOpen}
                defaultName={user.name ?? ""}
                onSubmit={() => setIsNameDialogOpen(false)}
              />
            </SettingsItem>
            <SettingsItem
              label="Under 18"
              description="Are you under 18 years old or applying on behalf of someone who is?"
            >
              <Switch
                name="isMinor"
                isSelected={user.isMinor ?? false}
                onChange={() => updateIsMinor({ isMinor: !user.isMinor })}
              >
                <span className="sr-only">Is minor</span>
              </Switch>
            </SettingsItem>
            <SettingsItem
              label="Residence"
              description="Where do you live? This location is used to select the forms for your court order and state ID."
            >
              <Button
                icon={Pencil}
                onPress={() => setIsResidenceDialogOpen(true)}
              >
                {user?.residence
                  ? JURISDICTIONS[user.residence as Jurisdiction]
                  : "Set residence"}
              </Button>
              <EditResidenceDialog
                isOpen={isResidenceDialogOpen}
                onOpenChange={setIsResidenceDialogOpen}
                defaultResidence={user.residence as Jurisdiction}
                onSubmit={() => setIsResidenceDialogOpen(false)}
              />
            </SettingsItem>
            <SettingsItem
              label="Birthplace"
              description="Where were you born? This location is used to select the forms for your birth certificate."
            >
              <Button
                icon={Pencil}
                onPress={() => setIsBirthplaceDialogOpen(true)}
              >
                {user?.birthplace
                  ? JURISDICTIONS[user.birthplace as Jurisdiction]
                  : "Set birthplace"}
              </Button>
              <EditBirthplaceDialog
                isOpen={isBirthplaceDialogOpen}
                onOpenChange={setIsBirthplaceDialogOpen}
                defaultBirthplace={user.birthplace as Jurisdiction}
                onSubmit={() => setIsBirthplaceDialogOpen(false)}
              />
            </SettingsItem>
          </SettingsSection>
          <SettingsSection title="Appearance">
            <SettingsItem label="Theme" description="Adjust your display.">
              <ToggleButtonGroup
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={themeSelection}
                onSelectionChange={setTheme}
              >
                {Object.entries(THEMES).map(([theme, details]) => (
                  <ToggleButton key={theme} id={theme}>
                    {details.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </SettingsItem>
          </SettingsSection>
          <SettingsSection title="Danger Zone">
            <SettingsItem
              label="Delete account"
              description="Permanently delete your Namesake account and data."
            >
              <Button
                onPress={() => setIsDeleteAccountDialogOpen(true)}
                icon={Trash}
              >
                Delete account
              </Button>
              <DeleteAccountDialog
                isOpen={isDeleteAccountDialogOpen}
                onOpenChange={setIsDeleteAccountDialogOpen}
                onSubmit={() => setIsDeleteAccountDialogOpen(false)}
              />
            </SettingsItem>
          </SettingsSection>
        </>
      )}
    </>
  );
}
