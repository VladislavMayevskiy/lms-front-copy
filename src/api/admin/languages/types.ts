// GET /api/admin/languages returns a plain array of objects with this shape.
// `getLanguages` normalises it to { data: ApiLanguageType[] }.
export type ApiLanguageType = {
  value: string;   // language code used as identifier, e.g. "en", "ko"
  label: string;   // display name, e.g. "English", "Korean"
  is_rtl: boolean; // right-to-left script flag
};

export type ApiLanguagesListResponse = {
  data: ApiLanguageType[];
};
