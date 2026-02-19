import { createColumnHelper } from "@tanstack/react-table";
import { HStack, Text} from "@chakra-ui/react";

export type StudentCourse = {
  id: number;
  school_id: number;
  provider_id: number;
  type: number;
  name: string;
  description: string;
  duration: number;
  instructor: string;
  about: string;
  achievements: string;
  status: number;
  position: number;
  progress: number;
  progress_status: number;
  modules_count: number;
};


const columnHelper = createColumnHelper<StudentCourse>();


export const StudentsCourseColumn = [
  columnHelper.accessor("name", {
    header: "Name",
    filterFn: "includesString",
    cell: ({ row }) => {
      const studentCourse = row.original;

      return (
        <HStack>
          <Text fontSize="14px" fontFamily="Lato">
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
        <HStack>
          <Text fontSize="14px" fontFamily="Lato">
             {studentCourse.instructor}
          </Text>
        </HStack>
      );
    },
  }),




];
