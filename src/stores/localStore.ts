import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LanguageEnumsType } from "types/general";

type LocalStore = {
  token: string;
  direction: 'ltr' | 'rtl';
  language: LanguageEnumsType;
  setToken: (token: string) => void;
  clearToken: () => void;
  setDirection: (direction: 'ltr' | 'rtl') => void;
  setLanguage: (language: LanguageEnumsType) => void;
};

export const localStore = create<LocalStore>()(
  persist(
    (set) => ({
      token: '',
      direction: 'ltr',
      language: 'en',
      setToken: (token: string) => set({ token }),
      clearToken: () => {
        set({ token: '' });
      },
      setDirection: (direction: 'ltr' | 'rtl') => set({ direction }),
      setLanguage: (language: LanguageEnumsType) => set({ language }),
    }),
    {
      name: 'lms-local-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
