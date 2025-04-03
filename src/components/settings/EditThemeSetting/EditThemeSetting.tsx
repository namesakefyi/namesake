import { ToggleButton, ToggleButtonGroup } from "@/components/common";
import { SettingsItem } from "@/components/settings";
import { useTheme } from "@/utils/useTheme";
import { THEMES } from "@convex/constants";

export const EditThemeSetting = () => {
  const { themeSelection, setTheme } = useTheme();

  return (
    <SettingsItem label="Theme">
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
  );
};
