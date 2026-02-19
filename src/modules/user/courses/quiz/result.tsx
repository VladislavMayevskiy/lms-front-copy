import { Box, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "components/ui/spinner";
import { useShowCourse } from "api/user/courses/hooks";
import { useGetQuizResult } from "api/user/courses/hooks";

type Props = {
  unitId: number;
  courseId: number;

  showCourseTitle?: boolean;
  title?: string;

  onBack?: () => void;
};

export default function UnitQuizResultContent({
  unitId,
  courseId,
  showCourseTitle = true,
  title = "Unit Quiz",
  onBack,
}: Props) {
  const { t } = useTranslation();

  const { data: course, isLoading: isCourseLoading } = useShowCourse(courseId);
  const { data: result, isLoading: isResultLoading } = useGetQuizResult(unitId);

  const questions = useMemo(() => {
    return Array.isArray((result as any)?.data) ? (result as any).data : [];
  }, [result]);

  const hasQuiz = questions.length > 0;

  if (isCourseLoading || isResultLoading) {
    return <Spinner isLoading={isCourseLoading || isResultLoading} />;
  }

  if (!hasQuiz) {
    return (
      <Box>
        {showCourseTitle && (
          <Heading mt="10px" fontFamily="Lato" fontWeight="semibold" fontSize="24px" mb={4}>
            {course?.name}
          </Heading>
        )}

        <Heading fontFamily="Lato" fontWeight="bold" fontSize="20px" mb={2}>
          {title}
        </Heading>

        <Text fontFamily="Lato" color="#434645" mb={6}>
          {t("user.courses.learn.noQuizForThisUnit")}
        </Text>

        {onBack ? (
          <Button variant="outline" borderColor="#B4D6DF" onClick={onBack}>
            {t("user.courses.learn.backToUnit")}
          </Button>
        ) : null}
      </Box>
    );
  }

  return (
    <Box className="lms-box">
      <VStack spacing={6} align="stretch">
        {questions.map((q: any, idx: number) => (
          <Box key={q.id} p={5} border="1px solid #B4D6DF" borderRadius="20px">
            <Text fontFamily="Lato" mb={4} fontSize="16px">
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

                    <Text fontSize="18px" fontFamily="Lato" fontWeight="medium">
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
    </Box>
  );
}
