import { ToggleButton, ToggleButtonGroup } from "@/components/common";
import { THEMES } from "@/constants";
import { useTheme } from "@/hooks/useTheme";

export const EditThemeSetting = () => {
  const { themeSelection, setTheme } = useTheme();

  return (
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
  );
};
