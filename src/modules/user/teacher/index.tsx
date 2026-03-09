import { useState, useCallback, useTransition } from "react";
import {
  Text,
  HStack,
  VStack,
  Select,
  Spinner as ChakraSpinner,
} from "@chakra-ui/react";

import UserLayout, { UserBox } from "components/ui/layouts/user";

import { useGetCourses } from "api/user/courses/hooks";

import AtRiskStudents from "./components/AtRiskStudents";
import CourseAnalyticsCard from "./components/CourseAnalyticsCard";
import CourseStudentsList from "./components/CourseStudentsList";
import UnitAnalyticsBlock from "./components/UnitAnalyticsBlock";


function Teacher() {
  const [isPending, startTransition] = useTransition();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const { data: courses, isLoading: isCoursesLoading } = useGetCourses();

  const handleCourseChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      startTransition(() => {
        setSelectedCourseId(val ? Number(val) : null);
      });
    },
    [startTransition],
  );

  return (
    <UserLayout title="Community Academics Association Prime District">
      <VStack spacing={6} align="stretch">

      <UserBox>
        <HStack justify="space-between" flexWrap="wrap" rowGap={2}>
          <VStack align="flex-start" spacing={0}>
            <Text fontFamily="Lato" fontWeight="semibold" fontSize="18px">
              Select a Course
            </Text>
            <Text fontFamily="Lato" fontSize="13px" color="#718096">
              Analytics, students and risk reports below filter to this course.
            </Text>
          </VStack>

          <HStack spacing={3}>
            {(isCoursesLoading || isPending) && (
              <ChakraSpinner size="sm" color="#0070C1" />
            )}
            <Select
              placeholder="Pick a course to analyse"
              width="340px"
              fontFamily="Lato"
              fontSize="14px"
              borderColor="#B4D6DF"
              borderRadius="8px"
              isDisabled={isCoursesLoading || isPending}
              value={selectedCourseId ?? ""}
              onChange={handleCourseChange}
            >
              {(courses ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </HStack>
        </HStack>
      </UserBox>

      <UserBox>
        <CourseAnalyticsCard courseId={selectedCourseId} />
      </UserBox>

      <UserBox>
        <AtRiskStudents courseId={selectedCourseId} />
      </UserBox>

      <UserBox>
        <CourseStudentsList />
      </UserBox>

      <UserBox>
        <UnitAnalyticsBlock courseId={selectedCourseId} />
      </UserBox>

      </VStack>
    </UserLayout>
  );
}

export default Teacher;
