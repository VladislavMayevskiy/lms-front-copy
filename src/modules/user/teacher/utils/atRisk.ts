import type { QuizAnalyticsQuestionEntry, TeacherStudent } from "api/user/types";

export const RISK_THRESHOLDS = {
  HIGH: 60,
  MEDIUM: 70,
} as const;

export type RiskLevel = "high" | "medium";

export type AtRiskStudent = {
  studentId: number;
  name: string;
  email?: string;
  image?: string | null;
  avgScore: number;
  totalAttempts: number;
  failedAttempts: number;
  riskScore: number;
};

export function getRiskLevel(avgScore: number): RiskLevel {
  return avgScore < RISK_THRESHOLDS.HIGH ? "high" : "medium";
}

export function resolveStudentName(student: TeacherStudent): string {
  if (student.name) return student.name;
  const full = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim();
  return full || `Student #${student.id}`;
}

export function buildStudentRowsFromQuestions(
  questions: QuizAnalyticsQuestionEntry[],
  studentsById: Map<number, TeacherStudent>,
): AtRiskStudent[] {
  const totalQuestions = questions.length;
  if (totalQuestions === 0) return [];

  const incorrectByUser = new Map<number, number>();
  for (const q of questions) {
    for (const rawId of q.incorrect_user_ids) {
      const uid = Number(rawId);
      incorrectByUser.set(uid, (incorrectByUser.get(uid) ?? 0) + 1);
    }
  }

  return [...incorrectByUser.entries()]
    .map(([userId, incorrectCount]): AtRiskStudent => {
      const avgScore = Math.max(
        0,
        Math.min(
          100,
          ((totalQuestions - incorrectCount) / totalQuestions) * 100,
        ),
      );
      const incorrectRate = incorrectCount / totalQuestions;
      const student = studentsById.get(userId);
      const name = student
        ? resolveStudentName(student)
        : `Student #${userId}`;

      return {
        studentId: userId,
        name,
        email: student?.email,
        image: student?.image ?? null,
        avgScore,
        totalAttempts: incorrectCount,
        failedAttempts: incorrectCount,
        riskScore: (100 - avgScore) + incorrectRate * 40,
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore);
}

export function computeAtRiskFromQuestions(
  questions: QuizAnalyticsQuestionEntry[],
  studentsById: Map<number, TeacherStudent>,
  topN = 10,
): AtRiskStudent[] {
  return buildStudentRowsFromQuestions(questions, studentsById)
    .filter((s) => s.avgScore < RISK_THRESHOLDS.MEDIUM)
    .slice(0, topN);
}
