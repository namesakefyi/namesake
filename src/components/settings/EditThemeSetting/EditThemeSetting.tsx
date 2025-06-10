import { useTheme } from "@/components/app";
import {
  Card,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { THEMES, THEME_COLORS, type Theme, type ThemeColor } from "@/constants";
import type { Key } from "react-aria-components";
import { tv } from "tailwind-variants";

interface ColorSwatchProps {
  color: ThemeColor;
}

const ColorSwatch = ({ color }: ColorSwatchProps) => {
  const swatchStyles = tv({
    base: "size-4 rounded-full",
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
      },
    },
  });
  return <div className={swatchStyles({ color })} />;
};

export const EditThemeSetting = () => {
  const { theme, setTheme, color, setColor } = useTheme();

  const handleThemeChange = (newTheme: Set<Key>) => {
    setTheme(Array.from(newTheme)[0] as Theme);
  };

  const handleColorChange = (newColor: Set<Key>) => {
    setColor(Array.from(newColor)[0] as ThemeColor);
  };

  return (
    <Card className="@container flex justify-center pb-4">
      <div className="flex flex-col @2xl:flex-row gap-6">
        <div className="flex flex-col gap-2">
          <ToggleButtonGroup
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set([theme ?? "system"])}
            onSelectionChange={handleThemeChange}
            className="w-max rounded-full"
          >
            {Object.entries(THEMES).map(([theme, { label, icon }]) => (
              <TooltipTrigger key={theme}>
                <ToggleButton
                  aria-label={label}
                  id={theme}
                  icon={icon}
                  className="rounded-full w-16"
                />
                <Tooltip>{label}</Tooltip>
              </TooltipTrigger>
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
            {Object.entries(THEME_COLORS).map(([color, { label, meaning }]) => (
              <TooltipTrigger key={color}>
                <ToggleButton
                  id={color}
                  aria-label={label}
                  className="rounded-full w-10 p-0"
                >
                  <ColorSwatch color={color as ThemeColor} />
                </ToggleButton>
                <Tooltip
                  className="flex flex-col items-center text-center"
                  color={color as ThemeColor}
                >
                  {label}
                  {meaning && (
                    <span className="italic text-xs -mt-0.5 mb-0.5 opacity-80">
                      {meaning}
                    </span>
                  )}
                </Tooltip>
              </TooltipTrigger>
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
