import type { ApiUnitSection } from "api/user/courses/types";
export type SectionTypes = "TITLE_AND_TEXT" | "IMAGE" | "ALBUM" | "VIDEO" | "DOCUMENT" | "AUDIO" | "EMBED" | "NOTE_FOR_TEACHER";

export type SectionFileType = {
  id: number;
  name: string;
  url: string;
  size: number;
  position: 1;
};

export type SectionType = {
  id: number;
  unitId: number;
  type: SectionTypes;
  title: string;
  content: string;
  position: number;
  files: SectionFileType[];
};

export type UiUnitSection = Omit<ApiUnitSection, "type"> & {
  type: SectionTypes;
};