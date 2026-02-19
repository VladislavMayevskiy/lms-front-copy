import { create } from "zustand";
import type { ApiModulesListParams } from "api/courseProvider/modules/types";

type ModulesParamsStore = {
  params?: ApiModulesListParams;
  setParams: (params?: ApiModulesListParams) => void;
};

export const useModulesParams = create<ModulesParamsStore>((set) => ({
  params: {
    search: '',
  },
  setParams: (params) => set({ params }),
}));
