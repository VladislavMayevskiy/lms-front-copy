import type { ApiDistrictSchool } from "../community/types";

export type ApiDistrictType = {
  id: number;
  name: string;
  phone: string;
  email: string;
  title: string;
  logo: string;
  schools_count:number;
  schools?: ApiDistrictSchool[];
};

export type ApiDistrictTypeList = {
  data: ApiDistrictType[];
};

export type ApiDistrictResponse = {
  data: ApiDistrictType;
};


export type GetDistrictParams = {
  sort?: string;
  search?: string;
};

