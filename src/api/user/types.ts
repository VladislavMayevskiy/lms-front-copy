
export type ChangePasswordType = {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}


export type QuizAnalyticsQuestionEntry = {
  question_id: number;
  question_content: string;
  total_answers: number;
  correct_answers: number;
  accuracy: number;
  incorrect_user_ids: number[];
};

export type QuizAnalyticsCourseResponse = {
  data: QuizAnalyticsQuestionEntry[];
};

export type QuizAnalyticsUnitResponse = QuizAnalyticsCourseResponse;

export type ActivityType = {
	completed_count: number
	total_duration: string
	uncompleted_count: number
}

export type ActivityResponse = {
	data: ActivityType
}

export type TeacherStudent = {
  id: number;
  school_id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  image: string | null;
  gender: number;
  birthday: string | null;
  role: number;
  created_at: string;
  language: string;
  timezone: string;
  theme: string;
  send_notifications: boolean;
  course_reminders: boolean;
  new_courses: boolean;
  assignment_feedback: boolean;
  progress_updates: boolean;
  announcements: boolean;
};

export type PaginationLinks = {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
};

export type PaginationMeta = {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
  path: string;
};

export type TeacherStudentsResponse = {
  data: TeacherStudent[];
  links: PaginationLinks;
  meta: PaginationMeta;
};

export type TeacherStudentCourse = {
  id: number;
  name: string;
  description?: string;
  instructor?: string;
  progress?: number;
  progress_status?: number;
  modules_count?: number;
  duration?: number;
  status?: number;
  image?: string | null;
};

export type TeacherStudentCoursesResponse = {
  data: TeacherStudentCourse[];
};

export type TeacherQuizResultEntry = {
  id?: number;
  unit_id?: number;
  unit_name?: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  answers?: any[];
};

export type TeacherStudentCourseQuizResultsResponse = {
  data: TeacherQuizResultEntry[];
};
