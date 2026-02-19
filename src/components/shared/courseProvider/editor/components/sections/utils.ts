import { SectionTypesById } from "constants/section";

export const isTextForm = (type: number): boolean => {
  switch (SectionTypesById[type]) {
    case "EMBED":
    case "NOTE_FOR_TEACHER":
    case "TITLE_AND_TEXT":
      return true;
    default:
      return false;
  }
};