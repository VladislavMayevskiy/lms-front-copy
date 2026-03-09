import { useMemo } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Badge,
  Skeleton,
  Button,
  Avatar,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useGetQuizAnalyticsCourse, useTeacherStudents } from "api/user/hooks";
import { UserRoutes } from "constants/routes";
import {
  computeAtRiskFromQuestions,
  getRiskLevel,
  type AtRiskStudent,
} from "../utils/atRisk";
import type { TeacherStudent } from "api/user/types";

const RISK_STYLE: Record<
  "high" | "medium",
  { border: string; badgeScheme: string; scoreColor: string }
> = {
  high:   { border: "#FC8181", badgeScheme: "red",    scoreColor: "#C53030" },
  medium: { border: "#F6AD55", badgeScheme: "orange", scoreColor: "#C05621" },
};

function EmptyPlaceholder({
  text,
  borderColor,
  bg,
  textColor,
}: {
  text: string;
  borderColor: string;
  bg: string;
  textColor: string;
}) {
  return (
    <Box
      p={6}
      textAlign="center"
      borderRadius="8px"
      borderWidth="1px"
      borderColor={borderColor}
      bg={bg}
    >
      <Text fontFamily="Lato" color={textColor} fontSize="14px">
        {text}
      </Text>
    </Box>
  );
}

function StudentRow({
  student,
  courseId,
}: {
  student: AtRiskStudent;
  courseId: number | null;
}) {
  const navigate = useNavigate();
  const risk = getRiskLevel(student.avgScore);
  const style = RISK_STYLE[risk];

  return (
    <Box
      px="20px"
      py="14px"
      width="full"
      bgColor="white"
      borderColor={style.border}
      borderWidth="1px"
      borderRadius="8px"
    >
      <HStack justify="space-between" spacing={4} flexWrap="wrap" rowGap={2}>
        <HStack spacing={3} flex={1} minW={0}>
          <Avatar
            size="sm"
            name={student.name}
            src={student.image ?? undefined}
            bg="#DDECF7"
            color="#0070C1"
          />
          <VStack align="flex-start" spacing={0} minW={0}>
            <Text
              fontFamily="Lato"
              fontSize="14px"
              fontWeight="medium"
              isTruncated
              maxW="220px"
            >
              {student.name}
            </Text>
            {student.email && (
              <Text
                fontFamily="Lato"
                fontSize="12px"
                color="#718096"
                isTruncated
                maxW="220px"
              >
                {student.email}
              </Text>
            )}
          </VStack>
        </HStack>

        <HStack spacing={5} flexShrink={0}>
          <VStack spacing={0} align="flex-end">
            <Text fontFamily="Lato" fontSize="12px" color="#718096">Avg score</Text>
            <Text
              fontFamily="Lato"
              fontSize="16px"
              fontWeight="bold"
              color={style.scoreColor}
            >
              {student.avgScore.toFixed(0)}%
            </Text>
          </VStack>

          <VStack spacing={0} align="flex-end">
            <Text fontFamily="Lato" fontSize="12px" color="#718096">Wrong answers</Text>
            <Text fontFamily="Lato" fontSize="16px" fontWeight="bold" color="#434645">
              {student.totalAttempts}
            </Text>
          </VStack>

          <Badge
            colorScheme={style.badgeScheme}
            px={3}
            py={1}
            borderRadius="full"
            textTransform="capitalize"
            fontFamily="Lato"
            fontSize="12px"
          >
            {risk} risk
          </Badge>

          <Button
            size="sm"
            variant="outline"
            borderColor="#0070C1"
            color="#0070C1"
            fontFamily="Lato"
            fontSize="13px"
            borderRadius="6px"
            _hover={{ bg: "#DDECF7" }}
            onClick={() => {
              const dest = courseId
                ? UserRoutes.quiz
                    .replace(":id", String(student.studentId))
                    .replace(":courseId", String(courseId))
                : UserRoutes.studentCourse.replace(":id", String(student.studentId));
              navigate(dest);
            }}
          >
            View details
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

type Props = {
  courseId: number | null;
};

export default function AtRiskStudents({ courseId }: Props) {
  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isError,
  } = useGetQuizAnalyticsCourse(courseId ?? undefined);

  const { data: studentsData } = useTeacherStudents();

  const studentsById = useMemo<Map<number, TeacherStudent>>(() => {
    const rows = studentsData?.data ?? [];
    return new Map(rows.map((s) => [s.id, s]));
  }, [studentsData]);

  const atRiskStudents = useMemo(
    () =>
      computeAtRiskFromQuestions(
        analyticsData?.data ?? [],
        studentsById,
      ),
    [analyticsData, studentsById],
  );

  const isDataLoading = isAnalyticsLoading && !!courseId;

  return (
    <Box mt={6}>
      <Text fontFamily="Lato" fontWeight="medium" fontSize="20px" mb={4}>
        Students Who Need Attention
      </Text>

      {!courseId && (
        <EmptyPlaceholder
          text="Select a course above to see at-risk students."
          borderColor="#D7E8EE"
          bg="#F5F7F9"
          textColor="#718096"
        />
      )}

      {isDataLoading && (
        <VStack spacing="6px" align="stretch">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height="62px" borderRadius="8px" />
          ))}
        </VStack>
      )}

      {!isDataLoading && isError && !!courseId && (
        <EmptyPlaceholder
          text="Failed to load quiz analytics. Please try again."
          borderColor="#FC8181"
          bg="#FFF5F5"
          textColor="#C53030"
        />
      )}

      {!isDataLoading && !isError && !!courseId && atRiskStudents.length === 0 && analyticsData && (
        <EmptyPlaceholder
          text="🎉 No students need attention based on current quiz data for this course."
          borderColor="#9AE6B4"
          bg="#F0FFF4"
          textColor="#2F855A"
        />
      )}

      {!isDataLoading && !isError && atRiskStudents.length > 0 && !!courseId && (
        <VStack spacing="6px" align="stretch">
          {atRiskStudents.map((student) => (
            <StudentRow key={student.studentId} student={student} courseId={courseId} />
          ))}
        </VStack>
      )}
    </Box>
  );
}
