import moment from "moment";
import type { UnitType, QuizType } from "types/models/Unit";
import type { ApiUnitType, ApiQuizType } from "./types";

export const mapFromUnit = (unit: ApiUnitType): UnitType => {
  return {
    ...unit,
    moduleId: unit.module_id,
    createdAt: moment(unit.created_at).format("YYYY/MM/DD"),
    updatedAt: moment(unit.updated_at).format("YYYY/MM/DD"),
  };
};

export const mapFromUnits = (units: ApiUnitType[]): UnitType[] => {
  return units.map((unit) => mapFromUnit(unit));
};

export const mapFromQuiz = (quiz: ApiQuizType[]): QuizType[] => {
  return quiz.map(({ id, content, is_multiple, options }) => ({
    id,
    content,
    isMultiple: is_multiple,
    options: options.map(({ id, label, is_correct }) => ({
      id,
      label,
      isCorrect: is_correct,
    })),
  }));
};
