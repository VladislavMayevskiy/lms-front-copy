import type { ApiSchoolType, ApiSchoolsList } from "./types";
import type { SchoolType } from "types/models/School";
import type { CreateSchoolSchema , UpdateSchoolSchema} from "modules/admin/schools/components/modals/school/validation/school.schema";

export const mapFromSchool = (data: ApiSchoolType): SchoolType => {
  return {
    ...data,
    districtId: data.district_id,
    logo: data.logo || "",
  };
};

export const mapFromSchools = (data?: ApiSchoolsList): SchoolType[] => {
  const schools = data?.data.map((school => mapFromSchool(school)));

  return schools || [];
};

export const schoolCreateToFormData = (
  school: CreateSchoolSchema
): FormData => {
  const formData = new FormData();

  const keys: Array<keyof CreateSchoolSchema> = [
    "district_id",
    "name",
    "phone",
    "email",
    "country_code",
    "primary_color",
    "secondary_color",
    "subscription_type",
    "subscription_active",
    "logo",
  ];

  keys.forEach((key) => {
    const value = school[key];

    if (key === "logo") {
      if (value instanceof File) {
        formData.append("logo", value);
      }
      return;
    }

    if (value === undefined || value === null) return;

    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
      return;
    }

    formData.append(key, value.toString());
  });

  return formData;
};

export const schoolUpdateToFormData = (
  school: UpdateSchoolSchema
): FormData => {
  const formData = new FormData();

  const keys: Array<keyof UpdateSchoolSchema> = [
    "name",
    "phone",
    "email",
    "country_code",
    "primary_color",
    "secondary_color",
    "subscription_active",
    "logo",
  ];

  keys.forEach((key) => {
    const value = school[key];

    if (key === "logo") {
      if (value instanceof File) {
        formData.append("logo", value);
      }
      return;
    }

    if (value === undefined || value === null) return;

    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
      return;
    }

    formData.append(key, value.toString());
  });

  return formData;
};
