import {
  Box,
  HStack,
  Text,
  Heading,
  Button,
  Divider,
  VStack,
  Progress,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCompleteUnit,
  useShowCourse,
  useGetQuiz,
  useGetQuizResult,
  useSubmitQuiz,
} from "api/user/courses/hooks";
import type { FinalQuizSubmitPayload } from "api/user/courses/types";
import UnitQuizResultContent from "../quiz/result";
import UserLayout from "components/ui/layouts/user";
import Arrow from "assets/imgs/user/heroicons-outline/chevron.svg?react";

import { SectionTypesById } from "constants/section";

import ContinueIcon from "assets/imgs/user/heroicons-outline/continue.svg?react";
import CompletedIcon from "assets/imgs/user/heroicons-outline/complete.svg?react";
import LockedIcon from "assets/imgs/user/heroicons-outline/locked.svg?react";

import SectionRenderer from "../components/render";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Spinner } from "components/ui/spinner";
import { authStore } from "stores/authStore";
import {
  saveCourseProgress,
  loadCourseProgress,
  clearCourseProgress,
} from "utils/courseProgress";

type UnitUiStatus = "continue" | "completed" | "locked";

type FlatUnit = {
  unit: any;
  moduleId: number;
  moduleIndex: number;
  unitIndex: number;
};

type Step = "unit" | "quiz" | "results";

const noQuizAutoCache = new Set<string>();
const completePending = new Map<string, Promise<void>>();
const completeDone = new Set<string>();

function extractQuestions(quiz: any): any[] {
  const candidates = [quiz?.data, quiz?.data?.data, quiz?.data?.data?.data, quiz];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
}

function UnitQuizStep({
  unitId,
  courseId,
  courseName,
  onBack,
  onNoQuiz,
  onSuccess,
}: {
  unitId: number;
  courseId: number;
  courseName?: string;
  onBack: () => void;
  onNoQuiz: () => Promise<void>;
  onSuccess: () => Promise<void>;
}) {
  const { data: quiz, isLoading, isFetching, isFetched, isSuccess, isError, error, refetch} = useGetQuiz(unitId);

  const {
    data: existingResult,
    isLoading: isResultLoading,
    isFetched: isResultFetched,
  } = useGetQuizResult(unitId);

  const quizAlreadyCompleted =
    isResultFetched && !!(existingResult as any)?.data?.id;

  const { t } = useTranslation();
  const { mutateAsync: submitQuiz, isPending } = useSubmitQuiz(unitId);

  const [selected, setSelected] = useState<Record<number, number[]>>({});
  const [autoContinuing, setAutoContinuing] = useState(false);

  const questions = useMemo(() => extractQuestions(quiz), [quiz]);
  const hasQuiz = questions.length > 0;

  const statusCode = (error as any)?.response?.status;
  const noQuizBy404 = isError && statusCode === 404;
  const noQuizByEmpty = isSuccess && questions.length === 0;
  const isNoQuiz = isFetched && (noQuizBy404 || noQuizByEmpty);

  const canSubmit = hasQuiz && questions.length === Object.keys(selected).length;

  useEffect(() => {
    return () => {
      noQuizAutoCache.delete(String(unitId));
    };
  }, [unitId]);

  useEffect(() => {
    if (unitId <= 0) return;
    if (!isNoQuiz) return;

    const key = String(unitId);
    if (noQuizAutoCache.has(key)) return;

    noQuizAutoCache.add(key);
    setAutoContinuing(true);

    onNoQuiz().finally(() => setAutoContinuing(false));
  }, [unitId, isNoQuiz, onNoQuiz]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    const payload: FinalQuizSubmitPayload = {
      answers: Object.entries(selected).map(([qId, opts]) => ({
        question_id: Number(qId),
        options: opts,
      })),
    };

    await submitQuiz(payload);
    await onSuccess();
  };

  if (isLoading || isFetching || autoContinuing || isResultLoading) {
    return (
      <Box>
        <Heading fontFamily="Lato" fontSize="20px" fontWeight="bold" mb={3}>
          {t("user.courses.learn.unitQuiz")}
        </Heading>
        <Spinner />
      </Box>
    );
  }

  if (isError && statusCode !== 404) {
    return (
      <Box>
        <HStack justify="space-between" align="center" mb={4}>
          <Heading fontFamily="Lato" fontSize="20px" fontWeight="bold">
            {t("user.courses.learn.unitQuiz")}
          </Heading>
        </HStack>

        <Text fontFamily="Lato" color="#434645" mb={4}>
          {t("user.courses.learn.failedToLoadQuiz")}
        </Text>

        <HStack gap={3}>
          <Button onClick={() => refetch()} bg="#0070C1" color="white">
            {t("general.retry")}
          </Button>
          <Button variant="outline" borderColor="#B4D6DF" onClick={onBack}>
            {t("general.back")}
          </Button>
        </HStack>
      </Box>
    );
  }

  if (quizAlreadyCompleted) {
    return (
      <UnitQuizResultContent
        unitId={unitId}
        courseId={courseId}
        showCourseTitle={false}
        onBack={onBack}
        onContinue={onSuccess}
      />
    );
  }

  if (!hasQuiz) {
    return (
      <Box>
        <Heading fontFamily="Lato" fontSize="20px" fontWeight="bold" mb={3}>
          {t("user.courses.learn.unitQuiz")}
        </Heading>
        <Text fontFamily="Lato" color="#434645">
          {t("user.courses.learn.noQuizForThisUnit")}
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {courseName ? (
        <Heading mt="10px" fontFamily="Lato" fontWeight="semibold" fontSize="24px" mb={4}>
          {courseName}
        </Heading>
      ) : null}

      <HStack justify="space-between" align="center" mb={6}>
        <Heading fontFamily="Lato" fontSize="20px" fontWeight="bold">
          {t("user.courses.learn.unitQuiz")}
        </Heading>
      </HStack>

      <VStack spacing={6} align="stretch">
        {questions.map((q: any, idx: number) => (
          <Box key={q.id} p={5} border="1px solid #B4D6DF" borderRadius="20px">
            <Text fontFamily="Lato" mb={4} fontSize="16px">
              {idx + 1}. {q.content}
            </Text>

            <HStack wrap="wrap" spacing={10} align="center">
              {q.options.map((opt: any) => {
                const isSelectedOpt = selected[q.id]?.includes(opt.id);

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
                            [q.id]: isSelectedOpt
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
                      borderColor={isSelectedOpt ? "#0070C1" : "#C9E1EA"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {isSelectedOpt && <Box w="14px" h="14px" borderRadius="full" bg="#0070C1" />}
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

      <HStack justify="flex-end" mt={10}>
        <Button
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
      </HStack>
    </Box>
  );
}

function LearnCourse() {
  const { id, unitId } = useParams<{ id: string; unitId?: string }>();
  const { t } = useTranslation();
  const courseId = Number(id);
  const activeUnitId = unitId ? Number(unitId) : null;

  const navigate = useNavigate();
  const qc = useQueryClient();

  const userId = authStore((s) => s.user?.id);

  const { data: course, isLoading } = useShowCourse(courseId);
  const { mutateAsync: completeUnit } = useCompleteUnit(courseId);

  const [openModule, setOpenModule] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("unit");
  const [progressRestored, setProgressRestored] = useState(false);
  const pendingStepRef = useRef<Step | null>(null);

  const isCourseCompleted =
    course?.progress_status === 3 || Number(course?.progress) >= 100;

  const completeUnitOnce = async (unitIdToComplete: number) => {
    if (!unitIdToComplete) return;

    const key = `${courseId}:${unitIdToComplete}`;

    if (completeDone.has(key)) return;

    const pending = completePending.get(key);
    if (pending) {
      await pending;
      return;
    }

    const promise = (async () => {
      await completeUnit(unitIdToComplete);
      await qc.invalidateQueries({ queryKey: ["course", courseId] });
    })();

    completePending.set(key, promise);

    try {
      await promise;
      completePending.delete(key);
      completeDone.add(key);
    } catch (e) {
      completePending.delete(key);
      throw e;
    }
  };

  const flatUnits = useMemo<FlatUnit[]>(() => {
    if (!course) return [];

    const modulesSorted = [...course.modules].sort(
      (a: any, b: any) => a.position - b.position
    );

    return modulesSorted.flatMap((m: any, moduleIndex: number) => {
      const unitsSorted = [...m.units].sort(
        (a: any, b: any) => a.position - b.position
      );

      return unitsSorted.map((unit: any, unitIndex: number) => ({
        unit,
        moduleId: m.id,
        moduleIndex,
        unitIndex,
      }));
    });
  }, [course]);

  const currentFlat = useMemo(() => {
    if (flatUnits.length === 0) return null;

    if (isCourseCompleted) {
      if (activeUnitId) {
        return flatUnits.find((x) => x.unit.id === activeUnitId) ?? flatUnits[0];
      }
      return flatUnits[0];
    }

    if (!activeUnitId) return flatUnits[0];
    return flatUnits.find((x) => x.unit.id === activeUnitId) ?? flatUnits[0];
  }, [flatUnits, activeUnitId, isCourseCompleted]);

  const currentUnit = currentFlat?.unit ?? null;

  useEffect(() => {
    if (isLoading) return;
    if (progressRestored) return;

    if (!userId) {
      setProgressRestored(true);
      return;
    }

    const saved = loadCourseProgress(userId, courseId);

    if (saved) {
      const unitExists = flatUnits.some((f) => f.unit.id === saved.unitId);
      const targetUnitId = unitExists ? saved.unitId : null;

      if (targetUnitId) {
        if (saved.step === "quiz") {
          pendingStepRef.current = "quiz";
        }

        if (!activeUnitId) {
          navigate(`/learn/${courseId}/${targetUnitId}`, { replace: true });
        }
      }
    }

    setProgressRestored(true);
  }, [isLoading, progressRestored, flatUnits, activeUnitId, courseId, userId, navigate]);

  useEffect(() => {
    if (pendingStepRef.current) {
      setStep(pendingStepRef.current);
      pendingStepRef.current = null;
    } else {
      setStep("unit");
    }
  }, [currentUnit?.id]);

  useEffect(() => {
    if (!progressRestored) return;
    if (!currentUnit?.id || !userId) return;
    if (step === "results") return;

    saveCourseProgress(userId, courseId, {
      unitId: currentUnit.id,
      step: step as "unit" | "quiz",
    });
  }, [currentUnit?.id, step, progressRestored, userId, courseId]);

  useEffect(() => {
    if (isCourseCompleted && userId) {
      clearCourseProgress(userId, courseId);
    }
  }, [isCourseCompleted, userId, courseId]);

  const normalizedUnit = useMemo(() => {
    if (!currentUnit || !currentUnit.sections) return null;

    return {
      ...currentUnit,
      sections: currentUnit.sections.map((s: any) => ({
        ...s,
        type: SectionTypesById[s.type as number] ?? s.type,
      })),
    };
  }, [currentUnit]);

  const nextFlat = useMemo(() => {
    if (!currentFlat) return null;
    const idx = flatUnits.findIndex((x) => x.unit.id === currentFlat.unit.id);
    return idx >= 0 ? flatUnits[idx + 1] ?? null : null;
  }, [flatUnits, currentFlat, flatUnits]);

  const actionLabel = useMemo(() => {
    if (!currentFlat) return t("user.courses.learn.nextUnit");
    if (!nextFlat) return t("user.courses.learn.endCourse");
    const isModuleChange = nextFlat.moduleId !== currentFlat.moduleId;
    return isModuleChange
      ? t("user.courses.learn.nextModule")
      : t("user.courses.learn.nextUnit");
  }, [currentFlat, nextFlat, t]);

  const getUnitStatus = (unit: any): UnitUiStatus => {
    if (isCourseCompleted) return "completed";

    if (unit?.is_completed === true) return "completed";
    if (unit?.is_unlocked === false) return "locked";

    if (!currentUnit) return "locked";

    const currentIdx = flatUnits.findIndex((x) => x.unit.id === currentUnit.id);
    const idx = flatUnits.findIndex((x) => x.unit.id === unit.id);

    if (idx < currentIdx) return "completed";
    if (idx === currentIdx) return "continue";
    return "locked";
  };

  const afterUnitFinished = async () => {
    await qc.invalidateQueries({ queryKey: ["course", courseId] });
    navigateToNext();
  };

  const openUnit = (unitIdToOpen: number) => {
    if (!course) return;
    navigate(`/learn/${course.id}/${unitIdToOpen}`, { replace: true });
  };

  const navigateToNext = () => {
    if (!course || !currentFlat) return;

    const idx = flatUnits.findIndex((x) => x.unit.id === currentFlat.unit.id);
    const next = idx >= 0 ? flatUnits[idx + 1] ?? null : null;

    if (next) {
      if (next.moduleId !== currentFlat.moduleId) {
        setOpenModule(next.moduleId);
      }
      navigate(`/learn/${course.id}/${next.unit.id}`, { replace: true });
      return;
    }

    setStep("results");
  };

  const goNext = () => setStep("quiz");

  const pendingRestore = !progressRestored && !activeUnitId;

  if (isLoading || pendingRestore)
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-full">
          <Spinner isLoading />
        </div>
      </UserLayout>
    );

  if (!course)
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-full">
          <Text fontSize="18px" fontFamily="Lato" color="#434645">
            {t("user.courses.courseNotFound")}
          </Text>
        </div>
      </UserLayout>
    );

  return (
    <UserLayout>
      <Box className="flex md:flex-row flex-col gap-4">
        <Box
          p={"24px"}
          bgColor={"white"}
          borderColor={"#B4D6DF"}
          borderWidth={"1px"}
          borderRadius={"10px"}
          className="lms-box w-full md:w-2/3 md:min-h-[892px]"
        >
          {currentUnit && (
            <Heading fontFamily="Lato" fontSize="32px" fontWeight="medium" mb={4} noOfLines={2}>
              {currentFlat ? `Unit ${currentFlat.unitIndex + 1}: ` : ""}
              {currentUnit.name}
            </Heading>
          )}

          {isCourseCompleted && (
            <HStack gap={3} mb={4}>
              <Button
                variant={step === "unit" ? "solid" : "outline"}
                bg={step === "unit" ? "#0070C1" : "transparent"}
                color={step === "unit" ? "white" : "#0070C1"}
                borderColor="#B4D6DF"
                borderRadius="10px"
                _hover={{ bg: step === "unit" ? "#0070C1" : "transparent" }}
                onClick={() => setStep("unit")}
              >
                {t("user.courses.learn.content", "Content")}
              </Button>

              <Button
                variant={step === "results" ? "solid" : "outline"}
                bg={step === "results" ? "#0070C1" : "transparent"}
                color={step === "results" ? "white" : "#0070C1"}
                borderColor="#B4D6DF"
                borderRadius="10px"
                _hover={{ bg: step === "results" ? "#0070C1" : "transparent" }}
                onClick={() => setStep("results")}
              >
                {t("user.courses.learn.unitQuizResults", "Quiz results")}
              </Button>
            </HStack>
          )}

          {step === "unit" ? (
            <>
              <Text fontSize="14px" fontFamily="Lato" color="#434645" mb={4} noOfLines={4}>
                {currentUnit?.description}
              </Text>

              <Divider borderColor={"#B4D6DF"} borderWidth={"0.5px"} mb={5} />

              <VStack align="stretch" spacing={4}>
                {normalizedUnit?.sections?.map((section: any) => (
                  <SectionRenderer key={section.id} section={section} />
                ))}
              </VStack>

              <HStack justify="flex-end" mt={6} gap={3}>
                {!isCourseCompleted && (
                  <Button
                    bg="#0070C1"
                    textColor="white"
                    borderRadius="10px"
                    _hover={{ bg: "#005A9E" }}
                    onClick={goNext}
                  >
                    {actionLabel}
                  </Button>
                )}
              </HStack>
            </>
          ) : step === "quiz" ? (
            <>
              <Divider borderColor={"#B4D6DF"} borderWidth={"0.5px"} mb={5} />

              <UnitQuizStep
                unitId={currentUnit.id}
                courseId={courseId}
                courseName={course.name}
                onBack={() => setStep("unit")}
                onNoQuiz={async () => {
                  await completeUnitOnce(currentUnit.id);
                  await afterUnitFinished();
                }}
                onSuccess={async () => {
                  await afterUnitFinished();
                }}
              />
            </>
          ) : (
            <>
              <Divider borderColor={"#B4D6DF"} borderWidth={"0.5px"} mb={5} />

              <UnitQuizResultContent
                unitId={currentUnit.id}
                courseId={courseId}
                onBack={() => setStep("unit")}
              />
            </>
          )}
        </Box>

        <Box
          className="lms-box w-full md:max-w-1/3 md:min-h-[892px]"
          flex="1"
          bg="white"
          p={4}
          borderColor={"#B4D6DF"}
          borderWidth={"1px"}
          borderRadius="12px"
        >
          <VStack
            align={"flex-start"}
            w={"100%"}
            mb={"30px"}
            borderBottom={"1px"}
            borderColor={"#B4D6DF"}
          >
            <Heading fontFamily={"Lato"} fontSize={"20px"} fontWeight={"medium"} noOfLines={2}>
              {course.name}
            </Heading>

            <VStack mb={"10px"} w={"100%"} align={"flex-start"}>
              <HStack>
                <Text fontFamily={"Lato"} textColor={"#434645"} fontWeight={"medium"}>
                  {t("user.courses.progress")}{" "}
                </Text>
                <Text fontFamily={"Lato"} fontWeight={"semibold"}>
                  {course.progress} %
                </Text>
              </HStack>

              <Progress
                value={course.progress}
                colorScheme="black"
                width={"100%"}
                bg="#F5F7F9"
                sx={{ "& > div": { backgroundColor: "#76B16B" } }}
                borderRadius={"99px"}
              />
            </VStack>
          </VStack>

          <Heading fontSize="20px" fontWeight={"bold"} fontFamily={"Lato"} mb={3}>
            {t("user.courses.learn.courseContent")}
          </Heading>

          {course.modules
            .slice()
            .sort((a: any, b: any) => a.position - b.position)
            .map((module: any, index: number) => {
              const isOpen = openModule === module.id;

              const unitsSorted = module.units
                .slice()
                .sort((a: any, b: any) => a.position - b.position);

              return (
                <Box key={module.id} mb={4}>
                  <VStack align="start">
                    <Text fontWeight="bold" fontSize="15px" fontFamily="Lato" noOfLines={2}>
                      {t("user.courses.learn.module")} {index + 1}: {module.name}
                    </Text>

                    <Text fontSize="14px" fontFamily="Lato" color="gray.500" noOfLines={2}>
                      {module.description}
                    </Text>

                    {isOpen && (
                      <VStack align="stretch" mt={2} spacing={2} w="100%">
                        {unitsSorted.map((unit: any, uIndex: number) => {
                          const isActive = currentUnit?.id === unit.id;
                          const status = getUnitStatus(unit);

                          const Icon =
                            status === "completed"
                              ? CompletedIcon
                              : status === "locked"
                              ? LockedIcon
                              : ContinueIcon;

                          const isLocked = !isCourseCompleted && status === "locked";

                          return (
                            <Box
                              key={unit.id}
                              px={3}
                              py="13px"
                              borderColor={isActive ? "#0070C1" : "#CAE0C3"}
                              borderWidth="1px"
                              h="45px"
                              borderRadius="8px"
                              className="lms-dark-badge w-full"
                              bgColor={isActive ? "#DDECF7" : "white"}
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              cursor={isLocked ? "not-allowed" : "pointer"}
                              opacity={isLocked ? 0.6 : 1}
                              onClick={() => {
                                if (isLocked) return;
                                openUnit(unit.id);
                              }}
                            >
                              <HStack spacing={2} overflow="hidden" minW={0} flex={1}>
                                <Icon style={{ flexShrink: 0 }} />
                                <Heading fontFamily="Lato" fontSize="15px" fontWeight="medium" noOfLines={1} overflow="hidden">
                                  {t("user.courses.learn.unit")} {uIndex + 1}: {unit.name}
                                </Heading>
                              </HStack>
                            </Box>
                          );
                        })}
                      </VStack>
                    )}

                    <HStack
                      mt="1px"
                      mb="1px"
                      cursor="pointer"
                      onClick={() => setOpenModule(isOpen ? null : module.id)}
                    >
                      <Text textColor="#479AB1" fontSize="14px">
                        {isOpen
                          ? t("user.courses.learn.hideUnitDetails")
                          : t("user.courses.learn.showUnitDetails")}
                      </Text>
                      <Arrow
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "0.2s",
                        }}
                      />
                    </HStack>

                    <Divider borderRadius="0.5px" borderColor="#B4D6DF" />
                  </VStack>
                </Box>
              );
            })}
        </Box>
      </Box>
    </UserLayout>
  );
}

export default LearnCourse;
