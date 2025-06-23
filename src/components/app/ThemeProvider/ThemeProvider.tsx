// Forked from https://github.com/pacocoursey/next-themes/blob/main/next-themes/src/index.tsx

import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import * as React from "react";
import { THEMES, type Theme, type ThemeColor } from "@/constants";
import { script } from "./script";

export type Attribute = "class" | "data-theme" | "data-color";

export interface UseThemeProps {
  /** List of all available theme names */
  themes: Theme[];
  /** Active theme */
  theme?: Theme;
  /** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
  resolvedTheme?: Theme;
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: "dark" | "light" | undefined;
  /** Update the theme */
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  /** Active color name */
  color?: ThemeColor;
  /** If the active color is forced, this returns the forced color. Otherwise, identical to `color` */
  resolvedColor?: ThemeColor;
  /** Update the color */
  setColor: (color: ThemeColor) => void;
}

export interface ThemeProviderProps {
  /** List of all available theme names */
  themes?: Theme[];
  /** Active theme name */
  theme?: Theme;
  /** Default theme name */
  defaultTheme?: Theme;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean;
  /** HTML attribute modified based on the active theme. Accepts `class`, `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.), or an array which could include both */
  attribute?: Attribute | Attribute[];
  /** Key used to store theme setting in localStorage */
  storageKey?: string;
  /** Active color name */
  color?: ThemeColor;
  /** Default color name */
  defaultColor?: ThemeColor;
  /** Key used to store color setting in localStorage */
  colorStorageKey?: string;
  /** Child components */
  children?: React.ReactNode;
}

const colorSchemes = Object.keys(THEMES).filter(
  (theme) => theme !== "system",
) as ("light" | "dark")[];
const MEDIA = "(prefers-color-scheme: dark)";
const isServer = typeof window === "undefined";
const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);
const defaultContext: UseThemeProps = {
  setTheme: (_) => {},
  setColor: (_) => {},
  themes: [],
};

const saveToLS = (storageKey: string, value: string) => {
  // Save to storage
  try {
    localStorage.setItem(storageKey, value);
  } catch (_e) {
    // Unsupported
  }
};

export const useTheme = () => React.useContext(ThemeContext) ?? defaultContext;

export const ThemeProvider = (props: ThemeProviderProps) => {
  const context = React.useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return <>{props.children}</>;
  return <ThemeComponent {...props} />;
};

const ThemeComponent = ({
  defaultTheme = "system",
  enableColorScheme = true,
  attribute = "data-theme",
  storageKey = "theme",
  defaultColor = "rainbow",
  colorStorageKey = "color",
  children,
}: ThemeProviderProps) => {
  const updateTheme = useMutation(api.userSettings.setTheme);
  const updateColor = useMutation(api.userSettings.setColor);

  const [currentTheme, setThemeState] = React.useState<Theme>(() =>
    getTheme(storageKey, defaultTheme),
  );
  const [currentColor, setColorState] = React.useState<ThemeColor>(() =>
    getColor(colorStorageKey, defaultColor),
  );
  const [resolvedTheme, setResolvedTheme] = React.useState(() =>
    currentTheme === "system" ? getSystemTheme() : currentTheme,
  );

  const applyTheme = React.useCallback((newTheme: Theme) => {
    let resolved = newTheme;
    if (!resolved) return;

    // If theme is system, resolve it before setting theme
    if (newTheme === "system") {
      resolved = getSystemTheme();
    }

    const name = resolved;
    const d = document.documentElement;

    const handleAttribute = (attr: Attribute) => {
      if (attr === "class") {
        d.classList.remove("light", "dark");
        if (name) d.classList.add(name);
      } else if (attr.startsWith("data-")) {
        if (name) {
          d.setAttribute(attr, name);
        } else {
          d.removeAttribute(attr);
        }
      }
    };

    if (Array.isArray(attribute)) attribute.forEach(handleAttribute);
    else handleAttribute(attribute);

    if (enableColorScheme) {
      const fallback = colorSchemes.includes(defaultTheme as "light" | "dark")
        ? defaultTheme
        : null;
      const colorScheme = colorSchemes.includes(resolved as "light" | "dark")
        ? resolved
        : fallback;
      // @ts-ignore
      d.style.colorScheme = colorScheme;
    }
  }, []);

  const setTheme = React.useCallback(
    (newTheme: Theme | ((theme: Theme) => Theme)) => {
      if (typeof newTheme === "function") {
        setThemeState((prevTheme) => {
          const resolvedTheme = newTheme(prevTheme);
          saveToLS(storageKey, resolvedTheme);
          updateTheme({ theme: resolvedTheme });
          return resolvedTheme;
        });
      } else {
        setThemeState(newTheme);
        saveToLS(storageKey, newTheme);
        updateTheme({ theme: newTheme });
      }
    },
    [],
  );

  const setColor = React.useCallback((newColor: ThemeColor) => {
    setColorState(newColor);
    saveToLS(colorStorageKey, newColor);
    updateColor({ color: newColor });
    document.documentElement.setAttribute("data-color", newColor);
  }, []);

  const handleMediaQuery = React.useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setResolvedTheme(resolved);

      if (currentTheme === "system") {
        applyTheme("system");
      }
    },
    [currentTheme],
  );

  // Always listen to System preference
  React.useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    // @ts-ignore
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
        if (!e.newValue) {
          setTheme(defaultTheme);
        } else {
          setThemeState(e.newValue as Theme);
        }
      } else if (e.key === colorStorageKey) {
        if (!e.newValue) {
          setColor(defaultColor);
        } else {
          setColorState(e.newValue as ThemeColor);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setTheme, setColor]);

  // Whenever theme changes, apply it
  React.useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Apply initial color
  React.useEffect(() => {
    document.documentElement.setAttribute("data-color", currentColor);
  }, []);

  const providerValue = React.useMemo(
    () => ({
      theme: currentTheme,
      color: currentColor,
      setTheme,
      setColor,
      resolvedTheme: currentTheme === "system" ? resolvedTheme : currentTheme,
      resolvedColor: currentColor,
      themes: Object.keys(THEMES) as Theme[],
      systemTheme: resolvedTheme as "light" | "dark",
    }),
    [currentTheme, currentColor, setTheme, setColor, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScript
        {...{
          storageKey,
          colorStorageKey,
          attribute,
          enableColorScheme,
          defaultTheme,
          defaultColor,
          themes: Object.keys(THEMES) as Theme[],
        }}
      />

      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Props for the theme script component
 */
interface ThemeScriptProps extends Omit<ThemeProviderProps, "children"> {
  defaultTheme: Theme;
  defaultColor: ThemeColor;
}

const ThemeScript = React.memo(
  ({
    storageKey,
    colorStorageKey,
    attribute,
    enableColorScheme,
    defaultTheme,
    defaultColor,
    themes,
  }: ThemeScriptProps) => {
    const scriptArgs = JSON.stringify([
      attribute,
      storageKey,
      colorStorageKey,
      defaultTheme,
      defaultColor,
      undefined, // forcedTheme
      themes,
      true, // enableSystem is always true
      enableColorScheme,
    ]).slice(1, -1);

    // Create a script element with the theme initialization code
    const scriptContent = `(${script.toString()})(${scriptArgs})`;

    return (
      <script
        suppressHydrationWarning
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required to prevent flash of unstyled content
        dangerouslySetInnerHTML={{
          __html: scriptContent,
        }}
      />
    );
  },
);

const getTheme = (key: string, fallback: Theme): Theme => {
  if (isServer) return fallback;
  let theme: Theme | null = null;
  try {
    theme = localStorage.getItem(key) as Theme;
  } catch (_e) {
    // Unsupported
  }
  return theme || fallback;
};

const getColor = (key: string, fallback: ThemeColor): ThemeColor => {
  if (isServer) return fallback;
  let color: ThemeColor | null = null;
  try {
    color = localStorage.getItem(key) as ThemeColor;
  } catch (_e) {
    // Unsupported
  }
  return color || fallback;
};

const getSystemTheme = (
  e?: MediaQueryList | MediaQueryListEvent,
): "light" | "dark" => {
  const media = e || window.matchMedia(MEDIA);
  const isDark = media.matches;
  return isDark ? "dark" : "light";
};
