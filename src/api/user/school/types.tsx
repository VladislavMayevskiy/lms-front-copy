export type ApiSchoolType = {
  id: number;
  district_id: number;
  name: string;
  title?: string | null;
  country_code: string;
  phone: string;
  email: string;
  logo: string | null;
  logo_url?: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  subscription_type: number;
  subscription_active:boolean;
};

export type ApiSchoolsList = {
  data: ApiSchoolType[];
}