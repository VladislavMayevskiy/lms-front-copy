import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { authStore } from "stores/authStore";
import { useCurrentUserQuery } from "api/global/hooks";
import { localStore } from "stores/localStore";

import type { LanguageEnumsType } from "types/general";

export const useLoadCurrentUser = () => {
  const queryClient = useQueryClient();
  const setUser = authStore((store) => store.setUser);
  const token = localStore((store) => store.token);
  const language = localStore((store) => store.language);
  const setDirection = localStore((store) => store.setDirection);
  const setLanguage = localStore((store) => store.setLanguage);
  const { data, isLoading } = useCurrentUserQuery(Boolean(token));
  const { i18n } = useTranslation();

  useEffect(() => {
    if (data) {
      setUser(data);
      setDirection(data.language === "ar" ? "rtl" : "ltr");
      setLanguage(data.language as LanguageEnumsType);
    }
  }, [data]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      queryClient.clear();
    }
  }, [token]);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return { isLoading };
};
