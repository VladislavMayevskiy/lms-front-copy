import type { PropsWithChildren } from "react";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { authStore } from "stores/authStore";
import { getSchool } from "api/user/school";
import type { ApiSchoolType } from "api/user/school/types";
import { isForceDefaultBrandingEnabled } from "constants/env";
import {
  defaultSchoolBranding,
  forcedDefaultSchoolBranding,
  mapApiSchoolToBranding,
  schoolBrandingQueryKey,
  type SchoolBranding,
} from "./schoolBranding";
import {
  SchoolBrandingContext,
  type SchoolBrandingContextValue,
} from "./schoolBrandingContext";

const BRANDING_STALE_MS = 1000 * 60 * 5;

function applyBrandingCssVars(branding: SchoolBranding) {
  const root = document.documentElement;
  root.style.setProperty("--brand-primary", branding.primaryColor);
  root.style.setProperty("--brand-secondary", branding.secondaryColor);

  root.style.setProperty("--accent-main", branding.primaryColor);
  root.style.setProperty("--color-primary", branding.primaryColor);
}

function useSchoolBrandingIdentity() {
  const schoolIdRaw = authStore((s) => s.user?.school_id);
  const role = authStore((s) => s.user?.role) ?? null;

  return useMemo(() => {
    const schoolId =
      typeof schoolIdRaw === "number" && schoolIdRaw > 0 ? schoolIdRaw : null;
    return { schoolId, role };
  }, [schoolIdRaw, role]);
}

export default function SchoolBrandingProvider({ children }: PropsWithChildren) {
  const forceDefaultBranding = isForceDefaultBrandingEnabled();
  const { schoolId, role } = useSchoolBrandingIdentity();

  const isSchoolScopedRole =
    role === "SchoolAdmin" ||
    role === "SchoolCourseProvider" ||
    role === "Teacher" ||
    role === "Student";

  const shouldApplySchoolBranding = isSchoolScopedRole && schoolId != null;

  const query = useQuery<ApiSchoolType | null>({
    queryKey: schoolId != null ? schoolBrandingQueryKey(schoolId) : ["school-branding", "none"],
    enabled: !forceDefaultBranding && shouldApplySchoolBranding && schoolId != null,
    queryFn: async () => {
      if (schoolId == null || !shouldApplySchoolBranding) return null;
      return await getSchool(schoolId);
    },
    staleTime: BRANDING_STALE_MS,
    placeholderData: (previousData) => previousData,
  });

  const branding = useMemo(() => {
    // TEMPORARY PRODUCTION OVERRIDE:
    // When enabled, force legacy/default branding (logo + colors) globally and skip per-school queries.
    if (forceDefaultBranding) return forcedDefaultSchoolBranding;
    if (!shouldApplySchoolBranding) return defaultSchoolBranding;
    return mapApiSchoolToBranding(query.data);
  }, [forceDefaultBranding, query.data, shouldApplySchoolBranding]);

  useEffect(() => {
    applyBrandingCssVars(branding);
  }, [branding]);

  const value: SchoolBrandingContextValue = useMemo(() => {
    const isLoading =
      forceDefaultBranding ? false : shouldApplySchoolBranding ? query.isLoading : false;
    return { branding, isLoading };
  }, [branding, forceDefaultBranding, query.isLoading, shouldApplySchoolBranding]);

  return (
    <SchoolBrandingContext.Provider value={value}>
      {children}
    </SchoolBrandingContext.Provider>
  );
}
