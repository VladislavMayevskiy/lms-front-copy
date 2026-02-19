import { Box, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useGetQuiz, useSubmitQuiz } from "api/user/courses/hooks";
import { useShowCourse } from "api/user/courses/hooks";
import type { FinalQuizSubmitPayload } from "api/user/courses/types";
import { useTranslation } from "react-i18next";
import { Spinner } from "components/ui/spinner";

type Props = {
  unitId: number;
  courseId: number;
  onSuccess?: () => void | Promise<void>;

  showCourseTitle?: boolean;
  title?: string;

  onBack?: () => void;
};

export default function UnitQuizContent({
  unitId,
  courseId,
  onSuccess,
  showCourseTitle = true,
  title = "Unit Quiz",
  onBack,
}: Props) {
  const { t } = useTranslation();
  const { data: quiz, isLoading: isQuizLoading } = useGetQuiz(unitId);
  const { mutateAsync: submitQuiz, isPending } = useSubmitQuiz(unitId);

  const { data: course, isLoading: isCourseLoading } = useShowCourse(courseId);

  const [selected, setSelected] = useState<Record<number, number[]>>({});

  const questions = useMemo(() => {
    return Array.isArray((quiz as any)?.data) ? (quiz as any).data : [];
  }, [quiz]);

  const hasQuiz = questions.length > 0;

  const canSubmit = useMemo(() => {
    if (!hasQuiz) return false;
    return questions.length === Object.keys(selected).length;
  }, [hasQuiz, questions.length, selected]);

  const onSubmit = async () => {
    if (!hasQuiz || !canSubmit) return;

    const payload: FinalQuizSubmitPayload = {
      answers: Object.entries(selected).map(([qId, opts]) => ({
        question_id: Number(qId),
        options: opts,
      })),
    };

    await submitQuiz(payload, {
      onSuccess: () => {
        toast.success(t("user.courses.learn.quizSubmittedSuccessfully"));
      },
      onError: () => {
        toast.error(t("user.courses.learn.quizSubmittedFailed"));
      }
    });
    if (onSuccess) await onSuccess();
  };

  if (isQuizLoading || isCourseLoading) return <Spinner isLoading={isQuizLoading || isCourseLoading}/>;

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
          <Button
            variant="outline"
            borderColor="#B4D6DF"
            onClick={onBack}
          >
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

            <HStack wrap="wrap" spacing={10} align="center">
              {q.options.map((opt: any) => {
                const isSelected = selected[q.id]?.includes(opt.id);

                return (
                  <HStack
                    key={opt.id}
                    spacing="14px"
                    cursor="pointer"
                    onClick={() =>
                      setSelected((prev) => {
                        const prevVals = prev[q.id] ?? [];

                        if (q.is_multiple) {
                          return {
                            ...prev,
                            [q.id]: isSelected
                              ? prevVals.filter((v) => v !== opt.id)
                              : [...prevVals, opt.id],
                          };
                        }

                        return { ...prev, [q.id]: [opt.id] };
                      })
                    }
                  >
                    <Box
                      w="26px"
                      h="26px"
                      borderRadius="full"
                      border="2px solid"
                      borderColor={isSelected ? "#0070C1" : "#C9E1EA"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {isSelected && <Box w="14px" h="14px" borderRadius="full" bg="#0070C1" />}
                    </Box>

                    <Text fontSize="18px" fontFamily="Lato" fontWeight="medium">
                      {opt.label}
                    </Text>
                  </HStack>
                );
              })}
            </HStack>
          </Box>
        ))}
      </VStack>

      <Button
        mt={10}
        bg="#0070C1"
        color="white"
        borderRadius="10px"
        fontWeight="bold"
        isDisabled={!canSubmit}
        isLoading={isPending}
        onClick={onSubmit}
        _hover={{ bgColor: "#0070C1" }}
      >
        {t("user.courses.learn.sendAnswers")}
      </Button>
    </Box>
  );
}
