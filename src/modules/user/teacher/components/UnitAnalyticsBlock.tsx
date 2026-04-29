import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Select,
  Skeleton,
  Badge,
  Avatar,
} from "@chakra-ui/react";
import { useGetQuizAnalyticsUnit, useTeacherStudents } from "api/user/hooks";
import { useShowCourse } from "api/user/courses/hooks";
import { localStore } from "stores/localStore";
import {
  buildStudentRowsFromQuestions,
  getRiskLevel,
  type AtRiskStudent,
} from "../utils/atRisk";
import type { TeacherStudent } from "api/user/types";

function UnitStudentRow({ student }: { student: AtRiskStudent }) {
  const risk = getRiskLevel(student.avgScore);
  const passed = student.avgScore >= 60;

  return (
    <Box
      px="20px"
      py="12px"
      bgColor="white"
      borderWidth="1px"
      borderColor={passed ? "#D7E8EE" : risk === "high" ? "#FC8181" : "#F6AD55"}
      borderRadius="8px"
    >
      <HStack justify="space-between">
        <HStack flex={2} spacing={3} minW={0}>
          <Avatar
            size="sm"
            name={student.name}
            src={student.image ?? undefined}
            bg="var(--brand-secondary, #DDECF7)"
            color="var(--brand-primary, #0070C1)"
          />
          <Text fontFamily="Lato" fontSize="14px" isTruncated>
            {student.name}
          </Text>
        </HStack>

        <HStack flex={1} justify="flex-end" spacing={4}>
          <VStack spacing={0} align="flex-end">
            <Text fontFamily="Lato" fontSize="12px" color="#718096">Score</Text>
            <Text
              fontFamily="Lato"
              fontSize="15px"
              fontWeight="bold"
              color={passed ? "#2F855A" : "#C53030"}
            >
              {student.avgScore.toFixed(0)}%
            </Text>
          </VStack>

          <VStack spacing={0} align="flex-end">
            <Text fontFamily="Lato" fontSize="12px" color="#718096">Wrong</Text>
            <Text fontFamily="Lato" fontSize="15px" fontWeight="bold" color="#434645">
              {student.totalAttempts}
            </Text>
          </VStack>

          <Badge
            colorScheme={passed ? "green" : risk === "high" ? "red" : "orange"}
            px={3}
            py={1}
            borderRadius="full"
            fontFamily="Lato"
            fontSize="12px"
          >
            {passed ? "Passed" : `${risk} risk`}
          </Badge>
        </HStack>
      </HStack>
    </Box>
  );
}

type Props = { courseId: number | null };

export default function UnitAnalyticsBlock({ courseId }: Props) {
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const direction = localStore((s) => s.direction);

  useEffect(() => {
    setSelectedUnitId(null);
  }, [courseId]);

  const { data: course, isLoading: isCourseLoading } = useShowCourse(
    courseId as number,
  );
  const units = useMemo(
    () => (course?.modules ?? []).flatMap((m) => m.units ?? []),
    [course],
  );

  const {
    data: unitData,
    isLoading: isUnitLoading,
    isError,
  } = useGetQuizAnalyticsUnit(selectedUnitId ?? undefined);

  const { data: studentsData } = useTeacherStudents();

  const studentsById = useMemo<Map<number, TeacherStudent>>(() => {
    const rows = studentsData?.data ?? [];
    return new Map(rows.map((s) => [s.id, s]));
  }, [studentsData]);

  const studentRows = useMemo(
    () => buildStudentRowsFromQuestions(unitData?.data ?? [], studentsById),
    [unitData, studentsById],
  );

  const isDataLoading = isUnitLoading && !!selectedUnitId;

  return (
    <Box mt={6}>
      <HStack justify="space-between" mb={4} flexWrap="wrap" rowGap={2}>
        <Text fontFamily="Lato" fontWeight="medium" fontSize="20px">
          Unit Quiz Analytics
        </Text>

        <Select
          placeholder={
            !courseId
              ? "Select a course first"
              : isCourseLoading
              ? "Loading units…"
              : units.length === 0
              ? "No units with quizzes"
              : "Select a unit"
          }
          width={{ base: "100%", sm: "300px" }}
          maxW="100%"
          fontFamily="Lato"
          fontSize="14px"
          borderColor="#B4D6DF"
          borderRadius="8px"
          textAlign={direction === "rtl" ? "right" : "left"}
          isDisabled={!courseId || isCourseLoading || units.length === 0}
          value={selectedUnitId ?? ""}
          onChange={(e) =>
            setSelectedUnitId(e.target.value ? Number(e.target.value) : null)
          }
        >
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
      </HStack>

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
            Select a course above, then pick a unit to see per-student quiz analytics.
          </Text>
        </Box>
      )}

      {courseId && !selectedUnitId && !isCourseLoading && (
        <Box
          p={5}
          textAlign="center"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="#D7E8EE"
          bg="#F5F7F9"
        >
          <Text fontFamily="Lato" color="#718096" fontSize="14px">
            {units.length > 0
              ? "Select a unit from the dropdown to view analytics."
              : "No units found for this course."}
          </Text>
        </Box>
      )}

      {isDataLoading && (
        <VStack spacing="6px" align="stretch">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height="56px" borderRadius="8px" />
          ))}
        </VStack>
      )}

      {!isDataLoading && isError && !!selectedUnitId && (
        <Box
          p={5}
          textAlign="center"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="#FC8181"
          bg="#FFF5F5"
        >
          <Text fontFamily="Lato" color="#C53030" fontSize="14px">
            Failed to load unit analytics.
          </Text>
        </Box>
      )}

      {!isDataLoading && !isError && !!selectedUnitId && studentRows.length === 0 && unitData && (
        <Box
          p={5}
          textAlign="center"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="#9AE6B4"
          bg="#F0FFF4"
        >
          <Text fontFamily="Lato" color="#2F855A" fontSize="14px">
            🎉 No incorrect answers recorded for this unit.
          </Text>
        </Box>
      )}

      {!isDataLoading && !isError && studentRows.length > 0 && !!selectedUnitId && (
        <>
          <Box mb={2} height="44px" bgColor="var(--brand-secondary, #DDECF7)" borderRadius="8px">
            <HStack px="20px" height="full">
              <Text flex={2} fontFamily="Lato" fontSize="14px" color="#434645" fontWeight="medium">
                Student
              </Text>
              <HStack flex={1} justify="flex-end" spacing={4}>
                <Text fontFamily="Lato" fontSize="14px" color="#434645" fontWeight="medium">Score</Text>
                <Text fontFamily="Lato" fontSize="14px" color="#434645" fontWeight="medium">Wrong</Text>
                <Text fontFamily="Lato" fontSize="14px" color="#434645" fontWeight="medium" w="80px" textAlign="center">Status</Text>
              </HStack>
            </HStack>
          </Box>

          <VStack spacing="6px" align="stretch">
            {studentRows.map((student) => (
              <UnitStudentRow key={student.studentId} student={student} />
            ))}
          </VStack>
        </>
      )}
    </Box>
  );
}
