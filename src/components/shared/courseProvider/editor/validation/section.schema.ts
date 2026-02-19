import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const sectionSchema = z.object({
  type: z.number(),
  title: z.string(),
  content: z.string(),
  position: z.number(),
  files: z.array(z.custom<File>()).optional(),
});

export type SectionSchema = z.infer<typeof sectionSchema>;

export const sectionSchemaResolver = zodResolver(sectionSchema);