import languageNameMap from "language-name-map/map";

/**
 * Given a language code, return the language name. Set `native`
 * to return the name in that language instead of English.
 *
 * @example
 * formatLanguage("es")
 * // "Spanish"
 * formatLanguage("es", true)
 * // "Español"
 */
export const formatLanguage = (code?: string, native?: boolean) => {
  if (!code) {
    return undefined;
  }
  return native ? languageNameMap[code].native : languageNameMap[code].name;
};
