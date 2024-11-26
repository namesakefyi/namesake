import { api } from "@convex/_generated/api";
import type { Theme } from "@convex/constants";
import { useMutation } from "convex/react";
import { useTheme as useNextTheme } from "next-themes";
import type { Selection } from "react-aria-components";

export function useTheme() {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();

  const updateTheme = useMutation(api.userSettings.setTheme);

  const theme = (nextTheme ?? "system") as Theme;
  const themeSelection = new Set([theme]);

  const setTheme = (theme: Selection) => {
    const newTheme = [...theme][0] as Theme;
    // Update the theme in the database
    updateTheme({ theme: newTheme });
    // Update the theme in next-themes
    setNextTheme(newTheme);
  };

  return { theme, themeSelection, setTheme };
}
