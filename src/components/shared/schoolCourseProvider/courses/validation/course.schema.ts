import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const courseFormSchema = z.object({
  type: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.string().optional(),
  duration: z.string(),
  instructor: z.string(),
  position: z.number().nullable(),
  about: z.string(),
  status: z.number(),
  achievements: z.string(),
  image: z.custom<File>().nullable(),
});

export type CourseSchema = z.infer<typeof courseFormSchema>;

export const courseSchemaResolver = zodResolver(courseFormSchema);
