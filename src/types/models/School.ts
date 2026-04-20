import type { Nullable } from "../general";

export type SchoolType = {
  id: number;
  districtId: number;
  name: string;
  phone: string;
  email: string;
  logo: Nullable<string>;
  logoUrl?: Nullable<string>;
  primaryColor?: Nullable<string>;
  secondaryColor?: Nullable<string>;
};

export type CourseSchoolType = {
  id: number;
  title: string;
  name: string;
  logo: Nullable<string>;
};