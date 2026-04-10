
export type ApiBillingSummary = {
  card_brand: string;
  card_last4: string;
  card_exp_month: number;
  card_exp_year: number;
  cardholder_name: string;
  email?: string;
};


export type ApiSchoolType = {
  id: number;
  district_id: number;
  name: string;
  /** Display title (if returned by API); optional for backward compatibility */
  title?: string | null;
  country_code: string;
  phone: string;
  email: string;
  logo: string | null;
  primary_color: string;
  secondary_color: string;
  subscription_type: number;
  subscription_active:boolean;
  billing: ApiBillingSummary | null;

  district?: {
    id: number;
    name: string;
    phone: string;
    email: string;
  } | null;
};

export type ApiSchoolsList = {
  data: ApiSchoolType[];
};

export type ApiSchoolResponse = {
  data: ApiSchoolType[];
}

export type GetSchoolsParams = {
  sort?: string;
  search?: string;
};