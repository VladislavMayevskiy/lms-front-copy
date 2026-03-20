import type { Nullable } from "types/general";

export type ApiUserType = {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: number;
  birthday: string;
  role: number;
  phone: string;
  school_id: number | null;
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
  is_subscribed: boolean;
};

export type ApiUpdateUserType = {
  email: string;
  first_name: string;
  last_name: string;
  gender: number;
  birthday: string;
  phone: string;
  password: string;
  password_confirmation: string;
};

export type CurrentUserResponse = {
  data: ApiUserType;
};

export type ApiSchool = {
  id: number;
  name: string;
};

export type ApiSchoolsResponse = {
  data: ApiSchool[];
};