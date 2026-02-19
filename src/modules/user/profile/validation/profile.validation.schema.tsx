import { z } from "zod";

export const profileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name is required"),

    email: z
      .string()
      .trim()
      .email("Invalid email"),

    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((values, ctx) => {
    const { currentPassword, newPassword, confirmPassword } = values;
    if (!currentPassword && !newPassword && !confirmPassword) return;

    if (!currentPassword) {
      ctx.addIssue({
        path: ["currentPassword"],
        message: "Current password is required",
        code: z.ZodIssueCode.custom,
      });
    }

    if (!newPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        message: "New password is required",
        code: z.ZodIssueCode.custom,
      });
    } else if (newPassword.length < 8) {
      ctx.addIssue({
        path: ["newPassword"],
        message: "Password must be at least 8 characters",
        code: z.ZodIssueCode.custom,
      });
    }

    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type ProfileSchema = z.infer<typeof profileSchema>;
