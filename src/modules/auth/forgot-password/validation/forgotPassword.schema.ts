import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const forgotPasswordSchema = z.object({
  email: z.email(),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordResolver = zodResolver(forgotPasswordSchema);
