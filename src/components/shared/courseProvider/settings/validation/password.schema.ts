import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordSchema = z.object({
  old_password: z.string().min(1),
  new_password: z.string().min(1),
  new_password_confirmation: z.string().min(1),
}).superRefine(({ new_password, new_password_confirmation }, ctx) => {
  if (new_password !== new_password_confirmation) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match",
      path: ["new_password", "new_password_confirmation"],
    });
  }
});

export type PasswordSchema = z.infer<typeof passwordSchema>;

export const passwordSchemaResolver = zodResolver(passwordSchema);
