import { useTheme } from "@/components/app";
import { Card, ToggleButton, ToggleButtonGroup } from "@/components/common";
import { THEMES, THEME_COLORS, type Theme, type ThemeColor } from "@/constants";
import type { Key } from "react-aria-components";
import { tv } from "tailwind-variants";

export const EditThemeSetting = () => {
  const { theme, setTheme, color, setColor } = useTheme();

  const handleThemeChange = (newTheme: Set<Key>) => {
    setTheme(Array.from(newTheme)[0] as Theme);
  };

  const handleColorChange = (newColor: Set<Key>) => {
    setColor(Array.from(newColor)[0] as ThemeColor);
  };

  const swatchStyles = tv({
    base: "w-full h-full",
    variants: {
      color: {
        pink: "bg-pink-9",
        red: "bg-red-9",
        orange: "bg-orange-9",
        yellow: "bg-yellow-9",
        green: "bg-green-9",
        turquoise: "bg-turquoise-9",
        indigo: "bg-indigo-9",
        violet: "bg-violet-9",
        gray: "bg-gray-9",
        rainbow: "bg-rainbow",
      },
    },
  });

  return (
    <Card className="@container flex justify-center pb-4">
      <div className="flex flex-col @xl:flex-row gap-6">
        <div className="flex flex-col gap-2">
          <ToggleButtonGroup
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set([theme ?? "system"])}
            onSelectionChange={handleThemeChange}
            className="w-max mx-auto"
          >
            {Object.entries(THEMES).map(([theme, { label, icon }]) => (
              <ToggleButton
                aria-label={label}
                key={theme}
                id={theme}
                icon={icon}
                className="w-16"
              />
            ))}
          </ToggleButtonGroup>
          <div className="font-medium text-center">
            {THEMES[theme ?? "system"].label}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <ToggleButtonGroup
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set([color ?? "violet"])}
            onSelectionChange={handleColorChange}
            className="w-max mx-auto rounded-full"
          >
            {Object.entries(THEME_COLORS).map(([themeColor, { label }]) => (
              <ToggleButton
                id={themeColor}
                key={themeColor}
                aria-label={label}
                className="rounded-full p-2 w-10"
              >
                <div
                  className={swatchStyles({
                    color: themeColor as ThemeColor,
                  })}
                />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <div className="font-medium flex gap-2 justify-center">
            {THEME_COLORS[color ?? "violet"].label}
            <span className="italic text-dim">
              {THEME_COLORS[color ?? "violet"].meaning}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
