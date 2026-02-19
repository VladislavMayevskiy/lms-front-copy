import { create } from "zustand";
import type { ModuleType } from "types/models/Module";
import type { Nullable } from "types/general";

type ModuleStore = {
  module: Nullable<ModuleType>;
  setModule: (module: Nullable<ModuleType>) => void;
};

export const useModuleStore = create<ModuleStore>((set) => ({
  module: null,
  setModule: (module) => set({ module }),
}));