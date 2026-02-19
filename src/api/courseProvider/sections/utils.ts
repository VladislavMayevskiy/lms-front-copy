import type { SectionType } from "types/models/Section";
import type { ApiSectionType } from "./types";
import { SectionTypesById } from "constants/section";

export const mapFromSection = (section: ApiSectionType): SectionType => {
  return {
    ...section,
    unitId: section.unit_id,
    type: SectionTypesById[section.type],
  };
};

export const mapFromSections = (sections: ApiSectionType[]): SectionType[] => {
  return sections.map((section) => mapFromSection(section));
};
