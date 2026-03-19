export type Nullable<T> = T | null;

/**
 * All language codes supported by the user-facing language selector.
 *
 * The corresponding display labels live in `src/constants/languages.ts`.
 * i18next translation files live in `public/i18n/<code>.json`.
 * If a translation file is absent the app falls back to English (fallbackLng).
 */
export type LanguageEnumsType =
  | 'ar' // Arabic
  | 'bn' // Bengali
  | 'de' // German
  | 'en' // English
  | 'es' // Spanish
  | 'fr' // French
  | 'hi' // Hindi
  | 'it' // Italian
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'pl' // Polish
  | 'pt' // Portuguese
  | 'tr' // Turkish
  | 'uk' // Ukrainian
  | 'zh' // Chinese
