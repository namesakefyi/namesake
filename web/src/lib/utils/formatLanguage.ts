import languageNameMap from "language-name-map/map";

/**
 * @param code Language code (e.g. "en", "es", "fr")
 * @param native Whether to return the native language name (e.g. "English", "Español", "Français")
 * @returns The language name (e.g. "English", "Spanish", "French")
 */
export const formatLanguage = (code?: string, native?: boolean) => {
  if (!code) {
    return undefined;
  }
  return native ? languageNameMap[code].native : languageNameMap[code].name;
};
