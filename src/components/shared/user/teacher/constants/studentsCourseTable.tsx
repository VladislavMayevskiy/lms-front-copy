import { createColumnHelper } from "@tanstack/react-table";
import { HStack, Text } from "@chakra-ui/react";

/** Minimal course shape shared by both the old student endpoint and the
 *  teacher-scoped GET /api/teacher/students/{userId}/courses endpoint. */
export type StudentCourse = {
  id: number;
  name: string;
  instructor?: string | null;
  description?: string;
  duration?: number;
  progress?: number;
  progress_status?: number;
  modules_count?: number;
  status?: number;
  school_id?: number;
  provider_id?: number;
  type?: number;
  position?: number;
  about?: string;
  achievements?: string;
};

const columnHelper = createColumnHelper<StudentCourse>();

export const StudentsCourseColumn = [
  columnHelper.accessor("name", {
    header: "Name",
    filterFn: "includesString",
    cell: ({ row }) => {
      const studentCourse = row.original;

      return (
        <HStack overflow="hidden" minW={0}>
          <Text fontSize="14px" fontFamily="Lato" isTruncated minW={0} flex={1}>
            {studentCourse.name}
          </Text>
        </HStack>
      );
    },
  }),

  columnHelper.accessor("instructor", {
    header: "Instructor",
    filterFn: "includesString",
    cell: ({ row }) => {
      const studentCourse = row.original;

      return (
        <HStack overflow="hidden" minW={0}>
          <Text fontSize="14px" fontFamily="Lato" isTruncated minW={0} flex={1}>
            {studentCourse.instructor}
          </Text>
        </HStack>
      );
    },
  }),
];
