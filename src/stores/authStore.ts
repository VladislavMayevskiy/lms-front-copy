import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserType } from "types/models/User";
import type { Nullable } from "types/general";
import { normalizeTheme } from "utils/normalizeUser";

type Language = "en" | "ua" | "sk" | "ar";
type Theme = "light" | "dark";

type AuthStore = {
  user: Nullable<UserType>;
  theme: Theme;
  language: Language;
  hydrated: boolean;

  setHydrated: () => void;
  setUser: (user: Nullable<UserType>) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
};

export const authStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      theme: "light",
      language: "en",
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      setUser: (user) =>
        set({
          user,
          theme: normalizeTheme(user?.theme),
        }),

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "lms-auth-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // TEMP DEBUG (remove after diagnosing slow loads)
        // If this never runs, `Providers` will return null forever.
        console.timeLog?.("boot:providers", "authStore rehydrated");
        state?.setHydrated();
      },
    }
  )
);
