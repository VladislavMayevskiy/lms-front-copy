
export type SavedCourseStep = "unit" | "quiz";

export type CourseProgress = {
  unitId: number;
  step: SavedCourseStep;
};

const buildKey = (userId: number, courseId: number): string =>
  `course_progress_${userId}_${courseId}`;

const isValidProgress = (value: unknown): value is CourseProgress =>
  value !== null &&
  typeof value === "object" &&
  typeof (value as Record<string, unknown>).unitId === "number" &&
  ((value as Record<string, unknown>).step === "unit" ||
    (value as Record<string, unknown>).step === "quiz");

export const saveCourseProgress = (
  userId: number,
  courseId: number,
  progress: CourseProgress,
): void => {
  try {
    localStorage.setItem(buildKey(userId, courseId), JSON.stringify(progress));
  } catch {
  }
};

export const loadCourseProgress = (
  userId: number,
  courseId: number,
): CourseProgress | null => {
  try {
    const raw = localStorage.getItem(buildKey(userId, courseId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidProgress(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const clearCourseProgress = (userId: number, courseId: number): void => {
  try {
    localStorage.removeItem(buildKey(userId, courseId));
  } catch {}
};
