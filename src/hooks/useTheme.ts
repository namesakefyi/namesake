import type { Theme } from "@/constants";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useTheme as useNextTheme } from "next-themes";
import type { Selection } from "react-aria-components";

export function useTheme() {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();

  const updateTheme = useMutation(api.userSettings.setTheme);

  const theme = (nextTheme ?? "system") as Theme;
  const themeSelection = new Set([theme]);

  const THEME = {
    light: "#fcfcfd",
    dark: "#18191b",
  };

  const setTheme = (theme: Selection) => {
    const newTheme = [...theme][0] as Theme;
    // Update the theme in the database
    updateTheme({ theme: newTheme });
    // Update the theme in next-themes
    setNextTheme(newTheme);
    // Update the theme color meta tags
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      if (newTheme === "light") meta.setAttribute("content", THEME.light);
      if (newTheme === "dark") meta.setAttribute("content", THEME.dark);
      if (newTheme === "system") {
        // If system, reset the theme color meta tags to their default values
        if (meta.getAttribute("media") === "(prefers-color-scheme: light)") {
          meta.setAttribute("content", THEME.light);
        } else {
          meta.setAttribute("content", THEME.dark);
        }
      }
    }
  };

  return { theme, themeSelection, setTheme };
}
