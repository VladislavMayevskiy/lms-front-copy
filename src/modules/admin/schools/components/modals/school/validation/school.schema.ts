import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscriptionType } from "types/admin/subscription/types";

const baseSchoolSchema = z.object({
  district_id: z.number().optional(),

  name: z.string().trim().min(1, "Fill in the required field"),
  phone: z.string().trim().min(1, "Fill in the required field"),
  email: z.string().trim().email("Fill in the required field"),
  country_code: z.string().trim().length(2, "Invalid country code"),

  primary_color: z.string().trim().min(1, "Fill in the required field"),
  secondary_color: z.string().trim().min(1, "Fill in the required field"),
  logo: z.custom<File | null>().optional(),
});

export const createSchoolSchema = baseSchoolSchema
  .extend({
    subscription_type: z.union([
      z.literal(SubscriptionType.INVOICE),
      z.literal(SubscriptionType.STRIPE),
    ]),
    subscription_active: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.subscription_type === SubscriptionType.INVOICE &&
      typeof data.subscription_active !== "boolean"
    ) {
      ctx.addIssue({
        path: ["subscription_active"],
        message: "Subscription active is required for INVOICE",
        code: z.ZodIssueCode.custom,
      });
    }
  });


export const updateSchoolSchema = baseSchoolSchema.extend({
  subscription_active: z.boolean().optional(),
});

export const schoolSchema = baseSchoolSchema
  .extend({
    subscription_type: z
      .union([
        z.literal(SubscriptionType.INVOICE),
        z.literal(SubscriptionType.STRIPE),
      ])
      .optional(),
    subscription_active: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.subscription_type === SubscriptionType.INVOICE &&
      typeof data.subscription_active !== "boolean"
    ) {
      ctx.addIssue({
        path: ["subscription_active"],
        message: "Subscription active is required for INVOICE",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type CreateSchoolSchema = z.infer<typeof createSchoolSchema>;
export type UpdateSchoolSchema = z.infer<typeof updateSchoolSchema>;
export type SchoolFormValues = z.infer<typeof schoolSchema>;

export const createSchoolResolver = zodResolver(createSchoolSchema);
export const updateSchoolResolver = zodResolver(updateSchoolSchema);
export const schoolResolver = zodResolver(schoolSchema);
