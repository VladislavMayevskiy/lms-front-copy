import type { SectionFileType } from "types/models/Section";

export type ApiCourseType = {
  id: number;
  school_id: number;
  provider_id: number;
  type: number;
  name: string;
  description: string;
  price: string;
  status: number;
  about: string;
  achievements: string;
  position: number;
  modules_count: number;
  image: string;
  progress_status: number;
  progress: number;
};

export type UserCourseType = {
  id: number;
  school_id: number;
  provider_id: number;
  type: number;
  name: string;
  description: string;
  price: string;
  status: number;
  about: string;
  achievements: string;
  position: number;
  modules_count: number;
  image: string;
  progress_status: number;
  progress: number;
};

export type ApiCourseResponse = {
    data: ApiCourseType[]
}
    
export type UseGetCoursesParams = {
  category?: "featured" | "recommended" | "most_popular" | "beginner";
  page?: number;
  size?: number;
};

export type GetUserCoursesParams = {
  progress_status?: "not_started" | "started" | "completed"
  page?: number;
  size?: number;
};


 export type ApiUnitSection = {
  id: number
  unit_id: number
  type: number
  title: string | null
  content: string | null
  position: number
  files: SectionFileType[]
}


export type ApiUnit = {
  id: number
  module_id: number
  name: string
  description: string
  image: string | null
  position: number
  created_at: string
  updated_at: string
  sections: ApiUnitSection[] 
}

export type ApiModule = {
  id: number
  course_id: number
  name: string
  description: string
  position: number
  created_at: string
  updated_at: string
  units: ApiUnit[]
}

export type ApiCourseShow = {
  id: number
  school_id: number | null
  provider_id: number | null
  type: number
  name: string
  description: string
  price: string
  duration: number
  instructor: string
  status: number
  about: string
  achievements: string
  position: number
  image: string | null
  created_at: string
  updated_at: string
  progress_status: number
  progress: number
  modules: ApiModule[]
}

export type ApiCourseStart = {
  id: number
  school_id: number | null
  provider_id: number | null
  type: number
  name: string
  description: string
  price: string
  duration: number
  instructor: string
  status: number
  about: string
  achievements: string
  position: number
  image: string | null
  created_at: string
  updated_at: string
  modules: ApiModule[]
}

export type QuizAnswerItem = {
  question_id: number;
  options: number[];
};

export type FinalQuizSubmitPayload = {
  answers: QuizAnswerItem[];
};

export type PurchaseCourseType = {
  payment_method: string;
}

export type QuizOption = {
  id: number;
  label: string;
};

export type QuizQuestion = {
  id: number;
  content: string;
  is_multiple: boolean;
  options: QuizOption[];
};
