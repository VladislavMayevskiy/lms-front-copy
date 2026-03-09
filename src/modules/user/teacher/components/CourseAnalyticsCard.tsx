import { useMemo } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Skeleton,
  SimpleGrid,
} from "@chakra-ui/react";
import { useGetQuizAnalyticsCourse } from "api/user/hooks";
import { RISK_THRESHOLDS } from "../utils/atRisk";

function StatCard({
  label,
  value,
  color = "#0070C1",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <Box
      p={4}
      bg="white"
      borderWidth="1px"
      borderColor="#D7E8EE"
      borderRadius="8px"
      textAlign="center"
    >
      <Text fontFamily="Lato" fontSize="28px" fontWeight="bold" color={color}>
        {value}
      </Text>
      <Text fontFamily="Lato" fontSize="13px" color="#718096" mt={1}>
        {label}
      </Text>
    </Box>
  );
}

type Props = {
  courseId: number | null;
};

export default function CourseAnalyticsCard({ courseId }: Props) {
  const { data, isLoading, isError } = useGetQuizAnalyticsCourse(
    courseId ?? undefined,
  );

  const stats = useMemo(() => {
    const questions = data?.data ?? [];
    const totalQuestions = questions.length;
    if (totalQuestions === 0) return null;

    const avgAccuracy =
      (questions.reduce((sum, q) => sum + q.accuracy, 0) / totalQuestions) * 100;

    const passingQuestions = questions.filter(
      (q) => q.accuracy * 100 >= RISK_THRESHOLDS.HIGH,
    ).length;
    const passRate = Math.round((passingQuestions / totalQuestions) * 100);

    const atRiskSet = new Set<number>();
    for (const q of questions) {
      for (const uid of q.incorrect_user_ids) {
        atRiskSet.add(Number(uid));
      }
    }

    return {
      totalQuestions,
      avgScore: avgAccuracy,
      passRate,
      atRisk: atRiskSet.size,
    };
  }, [data]);

  return (
    <Box mt={6}>
      <Text fontFamily="Lato" fontWeight="medium" fontSize="20px" mb={4}>
        Course Quiz Overview
      </Text>

      {!courseId && (
        <Box
          p={5}
          textAlign="center"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="#D7E8EE"
          bg="#F5F7F9"
        >
          <Text fontFamily="Lato" color="#718096" fontSize="14px">
            Select a course to see analytics.
          </Text>
        </Box>
      )}

      {courseId && isLoading && (
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height="88px" borderRadius="8px" />
          ))}
        </SimpleGrid>
      )}

      {courseId && isError && (
        <Box
          p={5}
          textAlign="center"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="#FC8181"
          bg="#FFF5F5"
        >
          <Text fontFamily="Lato" color="#C53030" fontSize="14px">
            Failed to load course analytics.
          </Text>
        </Box>
      )}

      {courseId && !isLoading && !isError && !stats && data && (
        <Box
          p={5}
          textAlign="center"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="#D7E8EE"
          bg="#F5F7F9"
        >
          <Text fontFamily="Lato" color="#718096" fontSize="14px">
            No quiz data available for this course yet.
          </Text>
        </Box>
      )}

      {courseId && stats && (
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <StatCard label="Questions in quiz" value={stats.totalQuestions} />
          <StatCard
            label="Average accuracy"
            value={`${stats.avgScore.toFixed(0)}%`}
            color={
              stats.avgScore >= RISK_THRESHOLDS.MEDIUM
                ? "#2F855A"
                : stats.avgScore >= RISK_THRESHOLDS.HIGH
                ? "#C05621"
                : "#C53030"
            }
          />
          <StatCard
            label="Pass rate (≥ 60%)"
            value={`${stats.passRate}%`}
            color={stats.passRate >= 70 ? "#2F855A" : "#C53030"}
          />
          <StatCard
            label="Students with mistakes"
            value={stats.atRisk}
            color={stats.atRisk === 0 ? "#2F855A" : "#C53030"}
          />
        </SimpleGrid>
      )}

      {courseId && stats && (
        <HStack mt={4} spacing={3} align="center">
          <Text fontFamily="Lato" fontSize="13px" color="#434645" w="90px" flexShrink={0}>
            Avg accuracy
          </Text>
          <Box flex={1} bg="#EDF2F7" borderRadius="full" h="10px" overflow="hidden">
            <Box
              h="full"
              borderRadius="full"
              bg={
                stats.avgScore >= RISK_THRESHOLDS.MEDIUM
                  ? "#38A169"
                  : stats.avgScore >= RISK_THRESHOLDS.HIGH
                  ? "#DD6B20"
                  : "#E53E3E"
              }
              w={`${stats.avgScore}%`}
              transition="width 0.4s ease"
            />
          </Box>
          <Text fontFamily="Lato" fontSize="13px" color="#434645" w="36px" textAlign="right">
            {stats.avgScore.toFixed(0)}%
          </Text>
        </HStack>
      )}
    </Box>
  );
}
