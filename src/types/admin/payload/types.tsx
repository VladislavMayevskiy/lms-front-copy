import { z } from "zod";
import { updateDistrictSchema } from "modules/admin/districts/components/modals/district/validation/district.schema";
import type { UpdateSchoolSchema } from "modules/admin/schools/components/modals/school/validation/school.schema";

export type UpdateDistrictPayload = {
  id: number;
} & z.infer<typeof updateDistrictSchema>;

export type UpdateSchoolPayload = {
  id: number;
} & UpdateSchoolSchema;