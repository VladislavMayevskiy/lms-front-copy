import type { LanguageEnumsType } from "types/general";

/**
 * Canonical list of languages available in the user Settings language selector.
 *
 * Sorted alphabetically by English display label.
 * The `value` codes match exactly what the backend stores in `user.language`
 * and what i18next uses as the locale key (public/i18n/<value>.json).
 *
 * RTL languages (currently only Arabic) are flagged so layout code can
 * switch text direction without maintaining a separate list.
 */
export type SupportedLanguage = {
  value: LanguageEnumsType;
  label: string;
  /** true when the language is written right-to-left */
  rtl?: boolean;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { value: "ar", label: "Arabic",     rtl: true },
  { value: "bn", label: "Bengali" },
  { value: "zh", label: "Chinese" },
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "es", label: "Spanish" },
  { value: "tr", label: "Turkish" },
  { value: "uk", label: "Ukrainian" },
];

/**
 * Lookup helper: given a language code, return whether it is RTL.
 * Falls back to false for unknown codes so nothing breaks if a new language
 * is added to the backend before the frontend is updated.
 */
export const isRtlLanguage = (code: string): boolean =>
  SUPPORTED_LANGUAGES.some((l) => l.value === code && l.rtl === true);
