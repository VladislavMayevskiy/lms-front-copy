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
  /** Preferred language for course content — separate from UI/interface language.
   *  Backend requires a non-null, non-empty language code string. */
  preferred_course_language: z.string().min(1),
});

export type SettingsSchema = z.infer<typeof settingsSchema>;

export const settingsSchemaResolver = zodResolver(settingsSchema);