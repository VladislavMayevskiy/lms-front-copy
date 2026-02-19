import { client } from "api";
import { AdminApiRoutes, FormDataHeader } from "api/constants";
import type { ApiDistrictResponse, ApiDistrictTypeList, GetDistrictParams } from "./types";
import type { CreateDistrictSchema} from "modules/admin/districts/components/modals/district/validation/district.schema";
import { districtToFormData } from "./utils";
import type { UpdateDistrictPayload } from "types/admin/payload/types";

export const createDistrict = async (data: CreateDistrictSchema): Promise<ApiDistrictResponse> => {
  const headers = FormDataHeader;
  const formData = districtToFormData(data);
  const response  = await client.post(AdminApiRoutes.districts, formData, { headers });

  return response.data;
};

export const getDistrict = async ( params?: GetDistrictParams): Promise<ApiDistrictTypeList> => {
  const response = await client.get(AdminApiRoutes.districts, {
    params: {
      ...(params?.search && { "filter[search]": params.search }),
      ...(params?.sort && { sort: params.sort }),
    },
  });

  return response.data;
};

export const updateDistrict = async ( data: UpdateDistrictPayload): Promise<ApiDistrictResponse> => {
  const headers = FormDataHeader;

  const formData = districtToFormData(data);

  const response = await client.post(  `${AdminApiRoutes.districts}/${data.id}`, formData, { headers } );

  return response.data;
};

export const deleteDistrict = async (id: number): Promise<ApiDistrictResponse> => {
  const response = await client.delete(`${AdminApiRoutes.districts}/${id}`)

  return response.data
}

export const getDistrictById = async (id: number): Promise<ApiDistrictResponse> => {
  const response = await client.get(`${AdminApiRoutes.districts}/${id}`)

  return response.data
}