import { z } from "zod";

const createUserSchema = z
  .object({
    first_name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().email("Invalid email"),
    phone: z.string().trim().optional(),
    password: z.string().trim().min(6, "Min 6 characters required"),
    role: z.number().int().min(1).max(6),
    gender: z.number().int().min(1).max(3),
    birthday: z.string().trim().optional(),
    password_confirmation: z.string().trim().min(6, "Min 6 characters required"),
    school_id: z.number().nullable(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

export const updateUserSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().optional(),
  role: z.number().int().min(1).max(6),
  gender: z.number().int().min(1).max(3),
  birthday: z.string().trim().optional(),
  school_id: z.number().nullable(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;