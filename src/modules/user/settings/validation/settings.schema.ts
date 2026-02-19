import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const settingsSchema = z.object({
  send_notifications: z.boolean(),
  course_reminders: z.boolean(),
  new_courses: z.boolean(),
  assignment_feedback: z.boolean(),
  progress_updates: z.boolean(),
  announcements: z.boolean(),
  language: z.string(),
  timezone: z.string(),
  theme: z.custom<"light" | "dark">(),
});

export type SettingsSchema = z.infer<typeof settingsSchema>;

export const settingsSchemaResolver = zodResolver(settingsSchema);