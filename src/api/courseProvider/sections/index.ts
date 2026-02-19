import { client } from "api";
import { CourseProviderApiRoutes, FormDataHeader } from "api/constants";
import type {
  ApiSectionListResponse,
  ApiSectionTypeResponse,
} from "./types";

export const getSections = async (unitIdId: number): Promise<ApiSectionListResponse> => {
  const response = await client.get(CourseProviderApiRoutes.unitSections(unitIdId));

  return response.data;
};

export const createSection = async ({ unitId, section }: {unitId: number, section: FormData}): Promise<ApiSectionTypeResponse> => {
  const headers = FormDataHeader;
  const response = await client.post(CourseProviderApiRoutes.unitSections(unitId), section, { headers });

  return response.data;
};

export const getSection = async (sectionId: number): Promise<ApiSectionTypeResponse> => {
  const response = await client.get(`${CourseProviderApiRoutes.sections}/${sectionId}`);

  return response.data;
};

export const editSection = async ({ sectionId, section }: { sectionId: number, section: FormData }): Promise<ApiSectionTypeResponse> => {
  const headers = FormDataHeader;
  const response = await client.post(`${CourseProviderApiRoutes.sections}/${sectionId}`, section, { headers });

  return response.data;
};

export const reorderSections = async ({ unitId, ids }: { unitId: number; ids: number[]; }): Promise<{ unitId: number }> => {
  await client.patch(`${CourseProviderApiRoutes.unitSections(unitId)}`, { ids });

  return { unitId };
};

export const deleteSection = async (sectionId: number): Promise<number> => {
  await client.delete(`${CourseProviderApiRoutes.sections}/${sectionId}`);

  return sectionId;
};