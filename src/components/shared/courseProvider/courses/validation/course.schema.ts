import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const courseFormSchema = z.object({
  type: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  duration: z.string(),
  instructor: z.string(),
  position: z.number().nullable(),
  about: z.string(),
  status: z.number(),
  achievements: z.string(),
  schools: z.array(z.number()),
  image: z.custom<File>().nullable(),
});

export type CourseSchema = z.infer<typeof courseFormSchema>;

export const courseSchemaResolver = zodResolver(courseFormSchema);

const courseSchoolsSchema = z.object({
  ids: z.array(z.number()),
});

export type CourseSchoolsSchema = z.infer<typeof courseSchoolsSchema>;

export const courseSchoolsSchemaResolver = zodResolver(courseSchoolsSchema);
