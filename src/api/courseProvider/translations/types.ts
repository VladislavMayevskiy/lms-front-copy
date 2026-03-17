/**
 * Entity types that support translations.
 */
export type TranslationEntityType = 'course' | 'module' | 'section' | 'unit';

/**
 * A single translation item returned by GET .../translations.
 * The `language` key holds the language code; all other keys are translated fields.
 */
export type ApiTranslationItem = {
  language: string;
  [field: string]: string;
};

export type ApiTranslationsResponse = {
  data: ApiTranslationItem[];
};

/**
 * Payload shape for PUT .../translations/{language}.
 * All values are translated strings for that language.
 */
export type ApiTranslationUpdatePayload = {
  [field: string]: string;
};
