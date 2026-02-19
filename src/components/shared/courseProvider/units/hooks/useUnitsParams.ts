import { create } from "zustand";
import type { ApiUnitsListParams } from "api/courseProvider/units/types";

type UnitsParamsStore = {
  params?: ApiUnitsListParams;
  setParams: (params?: ApiUnitsListParams) => void;
};

export const useUnitsParams = create<UnitsParamsStore>((set) => ({
  params: {
    search: '',
  },
  setParams: (params) => set({ params }),
}));
