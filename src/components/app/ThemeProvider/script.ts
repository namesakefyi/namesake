// Forked from https://github.com/pacocoursey/next-themes/blob/main/next-themes/src/script.ts

export const script = (
  attribute: string | string[],
  storageKey: string,
  colorStorageKey: string,
  defaultTheme: string,
  defaultColor: string,
  themes?: string[],
  enableSystem = true,
  enableColorScheme = true,
) => {
  const getTheme = (key: string, fallback: string): string => {
    let theme: string | null = null;
    try {
      theme = localStorage.getItem(key);
    } catch (_e) {
      // Unsupported
    }
    return theme || fallback;
  };

  const getSystemTheme = (): string => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    return media.matches ? "dark" : "light";
  };

  const applyTheme = (theme: string, color: string) => {
    let resolved = theme;
    if (!resolved) return;

    // If theme is system, resolve it before setting theme
    if (theme === "system" && enableSystem) {
      resolved = getSystemTheme();
    }

    const name = resolved;
    const d = document.documentElement;

    const handleAttribute = (attr: string) => {
      if (attr === "class") {
        d.classList.remove(...(themes || []));
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
      const fallback = themes?.includes(defaultTheme) ? defaultTheme : null;
      const colorScheme = themes?.includes(resolved) ? resolved : fallback;
      // @ts-expect-error
      d.style.colorScheme = colorScheme;
    }

    // Apply color
    d.setAttribute("data-color", color);
  };

  // Initialize theme and color
  const theme = getTheme(storageKey, defaultTheme);
  const color = getTheme(colorStorageKey, defaultColor);
  applyTheme(theme, color);
};
