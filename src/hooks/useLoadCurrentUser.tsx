import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { authStore } from "stores/authStore";
import { useCurrentUserQuery } from "api/global/hooks";
import { localStore } from "stores/localStore";
import { isRtlLanguage } from "constants/languages";
import { getSchool } from "api/user/school";
import { schoolBrandingQueryKey } from "branding/schoolBranding";
import type { UserType } from "types/models/User";

import type { LanguageEnumsType } from "types/general";

function shouldPrefetchSchoolBranding(user: UserType) {
  const sid = user.school_id;
  if (typeof sid !== "number" || sid <= 0) return false;
  const r = user.role;
  return (
    r === "SchoolAdmin" ||
    r === "SchoolCourseProvider" ||
    r === "Teacher" ||
    r === "Student"
  );
}

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
      setDirection(isRtlLanguage(data.language) ? "rtl" : "ltr");
      setLanguage(data.language as LanguageEnumsType);

      if (shouldPrefetchSchoolBranding(data)) {
        const sid = data.school_id as number;
        void queryClient.prefetchQuery({
          queryKey: schoolBrandingQueryKey(sid),
          queryFn: () => getSchool(sid),
        });
      }
    }
  }, [data, queryClient, setDirection, setLanguage, setUser]);

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
