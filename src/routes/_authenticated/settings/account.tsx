import { PageHeader } from "@/components/app";
import {
  Button,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@/components/common";
import {
  DeleteAccountDialog,
  EditBirthplaceDialog,
  EditNameDialog,
  EditResidenceDialog,
  SettingsGroup,
  SettingsItem,
} from "@/components/settings";
import { useTheme } from "@/utils/useTheme";
import { api } from "@convex/_generated/api";
import { JURISDICTIONS, type Jurisdiction, THEMES } from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/settings/account")({
  component: SettingsAccountRoute,
});

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
          <SettingsGroup title="Personal Information">
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
          </SettingsGroup>
          <SettingsGroup title="Appearance">
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
          </SettingsGroup>
          <SettingsGroup title="Danger Zone">
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
          </SettingsGroup>
        </>
      )}
    </>
  );
}
