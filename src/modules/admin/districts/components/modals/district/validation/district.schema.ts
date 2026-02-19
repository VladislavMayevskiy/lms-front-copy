import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Nullable } from "types/general";

const createDistrictSchema = z.object({
  name: z.string().trim().min(1, "Fill in the required field"),
  phone: z.string().trim().min(1, "Fill in the required field"),
  email: z.string().trim().email("Fill in the required field"),
  schools: z.array(z.number()).min(1, "Fill in the required field").optional(),
  logo: z.custom<Nullable<File>>().optional(),
});

export const updateDistrictSchema = z.object({
  name: z.string().trim().min(1, "Fill in the required field"),
  phone: z.string().trim().min(1, "Fill in the required field"),
  title: z.string().trim().min(1, "Fill in").optional(),
  email: z.string().trim().email("Fill in the required field"),
  schools: z.array(z.number()).min(1, "Fill in the required field").optional(),
  logo: z.custom<Nullable<File>>().optional(),
});


export type CreateDistrictSchema = z.infer<typeof createDistrictSchema>;
export type updateDistrictSchema = z.infer<typeof updateDistrictSchema>;

export const createDistrictResolver = zodResolver(createDistrictSchema);
export const updateDistrictResolver = zodResolver(updateDistrictSchema)