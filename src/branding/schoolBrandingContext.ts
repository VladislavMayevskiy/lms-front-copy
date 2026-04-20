import { createContext } from "react";
import { defaultSchoolBranding, type SchoolBranding } from "./schoolBranding";

export type SchoolBrandingContextValue = {
  branding: SchoolBranding;
  isLoading: boolean;
};

export const SchoolBrandingContext = createContext<SchoolBrandingContextValue>({
  branding: defaultSchoolBranding,
  isLoading: false,
});

