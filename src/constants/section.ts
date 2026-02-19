import type { SectionTypes } from "types/models/Section";

export const SectionTypesById: Record<number, SectionTypes> = {
  1: "TITLE_AND_TEXT",
  2: "IMAGE",
  3: "ALBUM",
  4: "VIDEO",
  5: "DOCUMENT",
  6: "AUDIO",
  7: "EMBED",
  8: "NOTE_FOR_TEACHER",
};

export const SectionTypesByName: Record<SectionTypes, number> = {
  TITLE_AND_TEXT: 1,
  IMAGE: 2,
  ALBUM: 3,
  VIDEO: 4,
  DOCUMENT: 5,
  AUDIO: 6,
  EMBED: 7,
  NOTE_FOR_TEACHER: 8,
};

