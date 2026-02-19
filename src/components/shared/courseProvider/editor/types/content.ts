import type { ReactNode } from "react";
import type { SectionTypes } from "types/models/Section";

export type ContentType = {
  title: string;
  type: SectionTypes;
  icon: ReactNode;
};