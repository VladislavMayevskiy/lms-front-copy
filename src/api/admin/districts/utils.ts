import type { CreateDistrictSchema } from "modules/admin/districts/components/modals/district/validation/district.schema";
import type { UpdateDistrictPayload } from "types/admin/payload/types";

type DistrictFormTypes = CreateDistrictSchema | UpdateDistrictPayload;

export const districtToFormData = (
  district: DistrictFormTypes,
): FormData => {
  const formData = new FormData();

  formData.append("name", district.name);
  formData.append(
    "title",
    "title" in district && district.title
      ? district.title
      : district.name
  );
  formData.append("phone", district.phone);
formData.append("email", district.email);

district.schools?.forEach((schoolId) => {
  formData.append("schools[]", String(schoolId));
});


  if (district.logo instanceof File) {
    formData.append("logo", district.logo);
  }

  return formData;
};
