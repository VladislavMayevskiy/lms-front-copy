import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const loginResolver = zodResolver(loginSchema);
