import { create } from "zustand";
import type { UnitType } from "types/models/Unit";
import type { Nullable } from "types/general";

type UnitStore = {
  unit: Nullable<UnitType>;
  setUnit: (unit: Nullable<UnitType>) => void;
};

export const useUnitStore = create<UnitStore>((set) => ({
  unit: null,
  setUnit: (unit) => set({ unit }),
}));