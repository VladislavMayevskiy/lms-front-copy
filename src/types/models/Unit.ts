export type UnitType = {
  id: number;
  moduleId: number;
  name: string;
  description: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  image: string;
};

export type QuizOptionType = {
  id: number;
  label: string;
  isCorrect: boolean;
};

export type QuizType = {
  id: number;
  content: string;
  isMultiple: boolean;
  options: QuizOptionType[];
};
