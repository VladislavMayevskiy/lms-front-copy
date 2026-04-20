import type { PropsWithChildren } from "react";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { authStore } from "stores/authStore";
import { localStore } from "stores/localStore";
import { useCurrentUserQuery } from "api/global/hooks";
import { getSchool } from "api/user/school";
import type { ApiSchoolType } from "api/user/school/types";
import {
  defaultSchoolBranding,
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

  // Bridge to existing CSS tokens used across the app.
  root.style.setProperty("--accent-main", branding.primaryColor);
  root.style.setProperty("--color-primary", branding.primaryColor);
}

/**
 * Resolve school_id and role from React Query first, then auth store.
 * Fixes bootstrap race: current-user query often resolves before useLoadCurrentUser's setUser runs,
 * so store-only gating delayed branding for School Admin and School Course Provider.
 */
function useSchoolBrandingIdentity() {
  const token = localStore((s) => s.token);
  const { data: queryUser } = useCurrentUserQuery(Boolean(token));
  const sSid = authStore((s) => s.user?.school_id);
  const sRole = authStore((s) => s.user?.role);

  const qSid = queryUser?.school_id;
  const qRole = queryUser?.role;

  return useMemo(() => {
    const rawId = qSid ?? sSid;
    const schoolId =
      typeof rawId === "number" && rawId > 0 ? rawId : null;
    const role = qRole ?? sRole ?? null;
    return { schoolId, role };
  }, [qSid, sSid, qRole, sRole]);
}

export default function SchoolBrandingProvider({ children }: PropsWithChildren) {
  const { schoolId, role } = useSchoolBrandingIdentity();

  const isSchoolScopedRole =
    role === "SchoolAdmin" ||
    role === "SchoolCourseProvider" ||
    role === "Teacher" ||
    role === "Student";

  const shouldApplySchoolBranding = isSchoolScopedRole && schoolId != null;

  const query = useQuery<ApiSchoolType | null>({
    queryKey: schoolId != null ? schoolBrandingQueryKey(schoolId) : ["school-branding", "none"],
    enabled: shouldApplySchoolBranding && schoolId != null,
    queryFn: async () => {
      if (schoolId == null || !shouldApplySchoolBranding) return null;
      return await getSchool(schoolId);
    },
    staleTime: BRANDING_STALE_MS,
    placeholderData: (previousData) => previousData,
  });

  const branding = useMemo(() => {
    if (!shouldApplySchoolBranding) return defaultSchoolBranding;
    return mapApiSchoolToBranding(query.data);
  }, [query.data, shouldApplySchoolBranding]);

  useEffect(() => {
    applyBrandingCssVars(branding);
  }, [branding]);

  const value: SchoolBrandingContextValue = useMemo(() => {
    const isLoading = shouldApplySchoolBranding ? query.isLoading : false;
    return { branding, isLoading };
  }, [branding, query.isLoading, shouldApplySchoolBranding]);

  return (
    <SchoolBrandingContext.Provider value={value}>
      {children}
    </SchoolBrandingContext.Provider>
  );
}
