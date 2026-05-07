import type { ApiSchoolType } from "api/user/school/types";
import { env } from "constants/env";
import LegacyDefaultLogo from "assets/imgs/default-logo.png";

export type SchoolBranding = {
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
};

const DEFAULT_PRIMARY = "#0070C1";
const DEFAULT_SECONDARY = "#DDECF7";

/** Turn relative storage paths into absolute URLs the browser can load. */
export function resolveSchoolAssetUrl(url: string | null | undefined): string | null {
  if (url == null || url === "") return null;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = (env.API_URL ?? "").replace(/\/$/, "");
  if (!base) return trimmed;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}

export function mapApiSchoolToBranding(
  school: ApiSchoolType | null | undefined
): SchoolBranding {
  const rawLogo = school?.logo_url ?? school?.logo ?? null;
  const logoUrl = resolveSchoolAssetUrl(rawLogo);
  const primaryColor = school?.primary_color ?? DEFAULT_PRIMARY;
  const secondaryColor = school?.secondary_color ?? DEFAULT_SECONDARY;

  return { logoUrl, primaryColor, secondaryColor };
}

export const defaultSchoolBranding: SchoolBranding = {
  logoUrl: null,
  primaryColor: DEFAULT_PRIMARY,
  secondaryColor: DEFAULT_SECONDARY,
};

/**
 * TEMPORARY PRODUCTION OVERRIDE:
 * When `VITE_FORCE_DEFAULT_BRANDING=true`, we force this legacy/default branding for all schools.
 *
 * Keep this centralized so restoring per-school branding is a single-flag change.
 */
export const forcedDefaultSchoolBranding: SchoolBranding = {
  logoUrl: LegacyDefaultLogo,
  primaryColor: DEFAULT_PRIMARY,
  secondaryColor: DEFAULT_SECONDARY,
};

/** Dedicated key so admin Settings `["school", id]` does not double as branding cache. */
export const schoolBrandingQueryKey = (schoolId: number) =>
  ["school-branding", schoolId] as const;

