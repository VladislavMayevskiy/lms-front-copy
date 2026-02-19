import { client } from "api";
import { AdminApiRoutes } from "api/constants";
import type { ApiSchoolsList, GetSchoolsParams } from "./types";
import { FormDataHeader } from "api/constants";
import { schoolCreateToFormData,schoolUpdateToFormData } from "./utils";
import type { CreateSchoolSchema } from "modules/admin/schools/components/modals/school/validation/school.schema";
import type { UpdateSchoolPayload } from "types/admin/payload/types";

export const getSchools = async (params?: GetSchoolsParams): Promise<ApiSchoolsList> => {
    const response = await client.get(AdminApiRoutes.schools, {
    params: {
      ...(params?.search && { "filter[search]": params.search }),
      ...(params?.sort && { sort: params.sort }),
    },
  });

  return response.data;
};

export const createSchool = async(data: CreateSchoolSchema): Promise<ApiSchoolsList> => {
  const headers = FormDataHeader;
  const formData = schoolCreateToFormData(data);
  const response  = await client.post(AdminApiRoutes.schools, formData, { headers });

  return response.data
}

export const updateSchool = async (data: UpdateSchoolPayload) => {
  const headers = FormDataHeader;

  const formData = schoolUpdateToFormData(data);

  formData.append("_method", "PUT");

  const response = await client.post( `${AdminApiRoutes.schools}/${data.id}`, formData, { headers });

  return response.data;
};

export const deleteSchool = async (id: number): Promise<ApiSchoolsList> => {
  const response = await client.delete(`${AdminApiRoutes.schools}/${id}`)

  return response.data
}

export const getSchoolById = async (id: number) => {
  const response = await client.get(`${AdminApiRoutes.schools}/${id}`);
  return response.data;
};

export const updateSchoolById = async (id: number, data: UpdateSchoolPayload) => {
  const headers = FormDataHeader;
  const formData = schoolUpdateToFormData(data);
  formData.append("_method", "PUT");
  const response = await client.post( `${AdminApiRoutes.schools}/${id}`, formData, { headers });
  return response.data;
}