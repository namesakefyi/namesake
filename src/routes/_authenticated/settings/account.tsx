import { PageHeader } from "@/components/app";
import {
  DeleteAccountSetting,
  EditBirthplaceSetting,
  EditEmailSetting,
  EditMinorSetting,
  EditNameSetting,
  EditResidenceSetting,
  EditThemeSetting,
  SettingsGroup,
} from "@/components/settings";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_authenticated/settings/account")({
  component: SettingsAccountRoute,
});

function SettingsAccountRoute() {
  const user = useQuery(api.users.getCurrent);

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
            <EditNameSetting user={user} />
            <EditEmailSetting user={user} />
            <EditMinorSetting user={user} />
            <EditResidenceSetting user={user} />
            <EditBirthplaceSetting user={user} />
          </SettingsGroup>
          <SettingsGroup title="Appearance">
            <EditThemeSetting />
          </SettingsGroup>
          <SettingsGroup title="Danger Zone">
            <DeleteAccountSetting />
          </SettingsGroup>
        </>
      )}
    </>
  );
}
