import type { Nullable } from "../general";

export type UserRoleType = 'SuperAdmin' | 'CourseProvider' | 'Teacher' | 'Student' | 'SchoolAdmin' | 'SchoolCourseProvider';

export type UserType = {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: number;
  birthday: string;
  role: UserRoleType;
  phone: string;
  school_id: number;
  course_reminders: boolean;
  announcements: boolean;
  assignment_feedback: boolean;
  created_at: string;
  image: Nullable<string>;
  language: string;
  preferred_course_language: string | null;
  new_courses: boolean;
  progress_updates: boolean;
  send_notifications: boolean;
  theme: "light" | "dark";
  timezone: string;
  is_subscribed: boolean
};
