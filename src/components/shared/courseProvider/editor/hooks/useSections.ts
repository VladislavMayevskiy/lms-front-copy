import { create } from "zustand";
import type { SectionType } from "types/models/Section";

type SectionsStore = {
  sections: SectionType[];
  setSections: (sections: SectionType[]) => void;
};

export const useSections = create<SectionsStore>((set) => ({
  sections: [],
  setSections: (sections) => set({ sections }),
}));