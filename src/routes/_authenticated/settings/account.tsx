import { PageHeader } from "@/components/app";
import { Empty } from "@/components/common";
import {
  DeleteAccountSetting,
  EditEmailSetting,
  EditMinorSetting,
  EditNameSetting,
  EditThemeSetting,
  SettingsGroup,
} from "@/components/settings";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { UserX } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings/account")({
  component: SettingsAccountRoute,
});

function SettingsAccountRoute() {
  const user = useQuery(api.users.getCurrent);

  return (
    <>
      <PageHeader title="Account" mobileBackLink={{ to: "/settings" }} />
      {user === undefined ? (
        "Loading..."
      ) : user === null ? (
        <Empty
          title="User not found"
          subtitle="Try refreshing the page or signing out and back in."
          icon={UserX}
        />
      ) : (
        <div className="pb-8">
          <SettingsGroup title="Personal Information">
            <EditNameSetting user={user} />
            <EditEmailSetting user={user} />
            <EditMinorSetting user={user} />
          </SettingsGroup>
          <SettingsGroup title="Appearance">
            <EditThemeSetting />
          </SettingsGroup>
          <SettingsGroup title="Danger Zone">
            <DeleteAccountSetting user={user} />
          </SettingsGroup>
        </div>
      )}
    </>
  );
}
