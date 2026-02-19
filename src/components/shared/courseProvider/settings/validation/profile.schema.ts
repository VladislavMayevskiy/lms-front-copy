import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  gender: z.number().nonoptional(),
  birthday: z.string().nonoptional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export const profileSchemaResolver = zodResolver(profileSchema);
