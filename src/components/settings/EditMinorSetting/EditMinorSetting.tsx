import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Switch } from "@/components/common";
import { SettingsItem } from "@/components/settings";

type EditMinorSettingProps = {
  user: Doc<"users">;
};

export const EditMinorSetting = ({ user }: EditMinorSettingProps) => {
  const updateIsMinor = useMutation(api.users.setCurrentUserIsMinor);

  return (
    <SettingsItem label="Under 18" description="Are you applying as a minor?">
      <Switch
        name="isMinor"
        isSelected={user.isMinor ?? false}
        onChange={() => updateIsMinor({ isMinor: !user.isMinor })}
      >
        <span className="sr-only">Is minor</span>
      </Switch>
    </SettingsItem>
  );
};
