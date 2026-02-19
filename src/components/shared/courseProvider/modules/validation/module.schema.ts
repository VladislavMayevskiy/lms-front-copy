import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const moduleFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  position: z.number().nullable(),
});

export type ModuleSchema = z.infer<typeof moduleFormSchema>;

export const moduleSchemaResolver = zodResolver(moduleFormSchema);
