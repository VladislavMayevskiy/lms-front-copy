import { useContext } from "react";
import { SchoolBrandingContext } from "./schoolBrandingContext";

export function useSchoolBranding() {
  return useContext(SchoolBrandingContext);
}

