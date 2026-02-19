import { z } from "zod";

const createSchoolAdminUserSchema = z
  .object({
    first_name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().email("Invalid email"),
    phone: z.string().trim().min(1, "Phone is required"),
    password: z.string().trim().min(6, "Min 6 characters required"),
    role: z.number().int().min(1).max(6),
    gender: z.number().int().min(1).max(3),
    birthday: z.string().trim().min(1, "Birthday is required"),
    password_confirmation: z.string().trim().min(6, "Min 6 characters required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

export const updateSchoolAdminUserSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().min(1, "Phone is required"),
  role: z.number().int().min(1).max(6),
  gender: z.number().int().min(1).max(3),
  birthday: z.string().trim().optional(),
});

export type CreateSchoolAdminUserSchema = z.infer<typeof createSchoolAdminUserSchema>;
export type UpdateSchoolAdminUserSchema = z.infer<typeof updateSchoolAdminUserSchema>;
