// ISO 639-1 codes. English and Spanish come first, then the rest ordered
// by display name. Use `formatLanguage` to get the display name.
export const DIRECTORY_LANGUAGES = [
  "en",
  "es",
  "ar",
  "zh",
  "fr",
  "lo",
  "pt",
  "vi",
] as const;

export type DirectoryLanguage = (typeof DIRECTORY_LANGUAGES)[number];
