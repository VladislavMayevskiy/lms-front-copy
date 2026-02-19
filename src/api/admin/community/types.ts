import type { ApiPaginatioMetaType } from "api/types";

export type ApiCommunityType = {
  id: number;
  name: string;
  title: string;
  phone: string;
  email: string;
  logo: string | null;
  primary_color: string;
  secondary_color: string;

  district_id: number | null;

  district?: {
    id: number;
    name: string;
    phone: string;
    email: string;
  } | null;
};

export type ApiCommunityList = {
  data: ApiCommunityType[];
};

export type ApiCommunityResponse = {
  data: ApiCommunityType[];
  meta: ApiPaginatioMetaType;
};

export type ApiDistrictSchool = {
  id: number;
  name: string;
  phone: string;
  email: string;
  country_code: string;
  primary_color: string;
  secondary_color: string;
  logo: string | null;
};

export type GetSchoolsByDistrictParams = {
  sort?: string;
  search?: string;
};
