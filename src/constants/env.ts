export const env = {
  API_URL: import.meta.env.VITE_API_URL,
  FORCE_DEFAULT_BRANDING: import.meta.env.VITE_FORCE_DEFAULT_BRANDING,
};

export function isForceDefaultBrandingEnabled() {
  return String(env.FORCE_DEFAULT_BRANDING ?? "").toLowerCase() === "true";
}
