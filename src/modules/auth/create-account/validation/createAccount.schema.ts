import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createAccountSchema = z.object({
  email: z.email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  gender: z.number().nonoptional(),
  birthday: z.string().nonoptional(),
  password: z.string().nonoptional(),
  password_confirmation: z.string().nonempty(),
  role: z.number(),
  school_id: z.number(),
}).superRefine(({password, password_confirmation}, ctx) => {
  if (password !== password_confirmation) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match",
      path: ["password_confirmation"],
    });
  }
});

export type CreateAccountSchema = z.infer<typeof createAccountSchema>;

export const createAccountResolver = zodResolver(createAccountSchema);
