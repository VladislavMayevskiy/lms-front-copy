import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const unitFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  position: z.number().nullable(),
});

export type UnitSchema = z.infer<typeof unitFormSchema>;

export const unitSchemaResolver = zodResolver(unitFormSchema);
