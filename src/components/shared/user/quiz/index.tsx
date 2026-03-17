import { Box, Heading, Text, Button, VStack, HStack, Divider } from "@chakra-ui/react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import UserLayout, { UserBox } from "components/ui/layouts/user";
import { Spinner } from "components/ui/spinner";

import { useTeacherStudentCourseQuizResults } from "api/user/hooks";
import { useShowCourse } from "api/user/courses/hooks";

type RouteParams = {
  id: string;
  courseId: string;
};

type Props = {
  showCourseTitle?: boolean;
  title?: string;
};

export default function StudentQuizResultContent({
  showCourseTitle = true,
  title = "Unit Quiz",
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, courseId } = useParams<RouteParams>();

  const studentId = Number(id);
  const courseIdNumber = Number(courseId);

  const valid = studentId > 0 && courseIdNumber > 0;

  const { data: course, isLoading: isCourseLoading } = useShowCourse(
    valid ? courseIdNumber : (undefined as any)
  );

  const {
    data: result,
    isLoading: isResultLoading,
    isError: isResultError,
  } = useTeacherStudentCourseQuizResults(
    valid ? studentId : undefined,
    valid ? courseIdNumber : undefined,
  );

  const allAttempts = useMemo<any[]>(() => {
    const raw = (result as any)?.data;
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object" && (raw.id || raw.answers)) return [raw];
    return [];
  }, [result]);

  const unitMap = useMemo<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    const modules: any[] = (course as any)?.modules ?? [];
    for (const mod of modules) {
      for (const unit of mod.units ?? []) {
        map[unit.id] = unit.name;
      }
    }
    return map;
  }, [course]);

  const hasQuiz = allAttempts.length > 0 &&
    allAttempts.some((a: any) => Array.isArray(a.answers) && a.answers.length > 0);

  /* ── invalid route params ─────────────────────────────────────────── */
  if (!valid) {
    return (
      <UserLayout>
        <UserBox>
          <Heading fontFamily="Lato" fontWeight="bold" fontSize="20px" mb={2}>
            {t("user.teacher.quizUnavailable", "Quiz unavailable")}
          </Heading>
          <Text fontFamily="Lato" color="#434645" mb={6}>
            {t(
              "user.teacher.quizUnavailableDetail",
              "Could not determine which student or course to display. Please go back and try again."
            )}
          </Text>
          <Button variant="outline" borderColor="#B4D6DF" onClick={() => navigate(-1)}>
            {t("general.back", "Back")}
          </Button>
        </UserBox>
      </UserLayout>
    );
  }

  /* ── loading ──────────────────────────────────────────────────────── */
  if (isCourseLoading || isResultLoading) {
    return (
      <UserLayout>
        <Spinner isLoading />
      </UserLayout>
    );
  }

  /* ── API error ────────────────────────────────────────────────────── */
  if (isResultError) {
    return (
      <UserLayout>
        <UserBox>
          <Heading fontFamily="Lato" fontWeight="bold" fontSize="20px" mb={2}>
            {t("user.teacher.quizLoadFailed", "Failed to load quiz results")}
          </Heading>
          <Text fontFamily="Lato" color="#434645" mb={6}>
            {t(
              "user.teacher.quizLoadFailedDetail",
              "The quiz results could not be retrieved. The student may not have taken this quiz yet."
            )}
          </Text>
          <Button variant="outline" borderColor="#B4D6DF" onClick={() => navigate(-1)}>
            {t("general.back")}
          </Button>
        </UserBox>
      </UserLayout>
    );
  }

  /* ── no quiz attempts ─────────────────────────────────────────────── */
  if (!hasQuiz) {
    return (
      <UserLayout>
        <UserBox>
          <Box>
            {showCourseTitle && (
              <Heading mt="10px" fontFamily="Lato" fontWeight="semibold" fontSize="24px" mb={4} noOfLines={2}>
                {course?.name}
              </Heading>
            )}

            <Heading fontFamily="Lato" fontWeight="bold" fontSize="20px" mb={2}>
              {title}
            </Heading>

            <Text fontFamily="Lato" color="#434645" mb={6}>
              {t(
                "user.teacher.noQuizAttempts",
                "This student has not completed any quiz attempts for this course yet."
              )}
            </Text>

            <Button variant="outline" borderColor="#B4D6DF" onClick={() => navigate(-1)}>
              {t("general.back")}
            </Button>
          </Box>
        </UserBox>
      </UserLayout>
    );
  }

  /* ── quiz results — one section per unit attempt ──────────────────── */
  return (
    <UserLayout>
      <UserBox>
        <Box className="lms-box">
          {showCourseTitle && (
            <Heading mt="10px" fontFamily="Lato" fontWeight="semibold" fontSize="24px" mb={4} noOfLines={2}>
              {course?.name}
            </Heading>
          )}

          <Heading fontFamily="Lato" fontWeight="bold" fontSize="20px" mb={6}>
            {title}
          </Heading>

          {allAttempts.map((attempt: any, attemptIdx: number) => {
            const answers: any[] = Array.isArray(attempt.answers) ? attempt.answers : [];
            if (answers.length === 0) return null;

            const unitLabel: string =
              attempt.unit_name ??
              (attempt.unit_id ? (unitMap[attempt.unit_id] ?? `Unit ${attempt.unit_id}`) : null) ??
              `${t("user.teacher.attempt", "Attempt")} ${attemptIdx + 1}`;

            const questions = answers.map((a: any) => ({
              id: a.question_id,
              content: a.question_content,
              options: a.options ?? [],
              is_correct: a.is_correct,
            }));

            return (
              <Box key={attempt.id ?? attemptIdx} mb={10}>
                <Heading
                  fontFamily="Lato"
                  fontWeight="semibold"
                  fontSize="18px"
                  mb={4}
                  color="#0070C1"
                  noOfLines={2}
                >
                  {unitLabel}
                </Heading>

                <Box
                  p={4}
                  bg="rgba(0, 112, 193, 0.07)"
                  border="1px solid #B4D6DF"
                  borderRadius="12px"
                  mb={5}
                >
                  <Text fontFamily="Lato" fontWeight="bold" fontSize="20px" color="#0070C1">
                    {t("user.courses.learn.totalScore", "Total score")}: {attempt.score}/100
                  </Text>
                  <Text fontFamily="Lato" color="#434645" fontSize="14px" mt={1}>
                    {attempt.correct_answers}/{attempt.total_questions}{" "}
                    {t("user.courses.learn.correctAnswers", "correct")}
                  </Text>
                </Box>

                <VStack spacing={6} align="stretch">
                  {questions.map((q: any, idx: number) => (
                    <Box key={q.id} p={5} border="1px solid #B4D6DF" borderRadius="20px">
                      <Text fontFamily="Lato" mb={4} fontSize="16px" noOfLines={4} wordBreak="break-word">
                        {idx + 1}. {q.content}
                      </Text>

                      <VStack align="stretch" spacing={3}>
                        {(q.options ?? []).map((opt: any) => {
                          const isSelected = !!opt.is_selected;
                          const isCorrect = !!opt.is_correct;

                          const isSelectedCorrect = isSelected && isCorrect;
                          const isSelectedWrong = isSelected && !isCorrect;
                          const isMissedCorrect = !isSelected && isCorrect;

                          const borderColor = isSelectedCorrect
                            ? "#2F855A"
                            : isSelectedWrong
                            ? "#C53030"
                            : isMissedCorrect
                            ? "#2F855A"
                            : "#C9E1EA";

                          const bg = isSelectedCorrect
                            ? "rgba(47,133,90,0.10)"
                            : isSelectedWrong
                            ? "rgba(197,48,48,0.08)"
                            : isMissedCorrect
                            ? "rgba(47,133,90,0.06)"
                            : "transparent";

                          return (
                            <HStack
                              key={opt.id}
                              spacing="14px"
                              p={3}
                              border="1px solid"
                              borderColor={borderColor}
                              borderRadius="12px"
                              bg={bg}
                              align="center"
                            >
                              <Box
                                w="26px"
                                h="26px"
                                borderRadius="full"
                                border="2px solid"
                                borderColor={borderColor}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                              >
                                {isSelected ? (
                                  <Box
                                    w="14px"
                                    h="14px"
                                    borderRadius="full"
                                    bg={isSelectedCorrect ? "#2F855A" : "#C53030"}
                                  />
                                ) : null}
                              </Box>

                              <Text fontSize="18px" fontFamily="Lato" fontWeight="medium" noOfLines={2} wordBreak="break-word">
                                {opt.label}
                              </Text>

                              <Box ml="auto">
                                {isSelectedCorrect ? (
                                  <Text fontFamily="Lato" fontSize="13px" color="#2F7A33" fontWeight="semibold">
                                    {t("general.correct", "Correct")}
                                  </Text>
                                ) : isSelectedWrong ? (
                                  <Text fontFamily="Lato" fontSize="13px" color="#B42318" fontWeight="semibold">
                                    {t("general.wrong", "Wrong")}
                                  </Text>
                                ) : isMissedCorrect ? (
                                  <Text fontFamily="Lato" fontSize="13px" color="#2F7A33">
                                    {t("user.courses.learn.correctAnswer", "Correct answer")}
                                  </Text>
                                ) : null}
                              </Box>
                            </HStack>
                          );
                        })}
                      </VStack>
                    </Box>
                  ))}
                </VStack>

                {/* Divider between unit sections (not after the last one) */}
                {attemptIdx < allAttempts.filter((a: any) => Array.isArray(a.answers) && a.answers.length > 0).length - 1 && (
                  <Divider mt={8} borderColor="#B4D6DF" />
                )}
              </Box>
            );
          })}

          <Button mt={2} variant="outline" borderColor="#B4D6DF" onClick={() => navigate(-1)}>
            {t("general.back")}
          </Button>
        </Box>
      </UserBox>
    </UserLayout>
  );
}
