import { createColumnHelper } from "@tanstack/react-table";
import { HStack, Text } from "@chakra-ui/react";

export type StudentTableRow = {
  id: number;
  school_id: number;
  name: string;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  gender: number;
  birthday: string | null;
  role: number;
  created_at: string;
  image: string;
  language: string;
  timezone: string;
  theme: "light" | "dark";
  send_notifications: boolean;
  course_reminders: boolean;
  new_courses: boolean;
  assignment_feedback: boolean;
  progress_updates: boolean;
  announcements: boolean;
};

const columnHelper = createColumnHelper<StudentTableRow>();

export const StudentsColumn = [
  columnHelper.accessor("name", {
    header: "Name",
    filterFn: "includesString",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <HStack overflow="hidden">
          <Text
            fontSize="14px"
            fontFamily="Lato"
            isTruncated
            maxW="100%"
          >
            {student.first_name} {student.last_name}
          </Text>
        </HStack>
      );
    },
  }),

  columnHelper.accessor("phone", {
    header: "Phone",
    cell: ({ getValue }) => {
      const phone = getValue();

      return (
        <Text
          fontSize="14px"
          fontFamily="Lato"
          isTruncated
          color={phone ? "#1A202C" : "#000000ff"}
        >
          {phone ?? "—"}
        </Text>
      );
    },
  }),

  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => (
      <Text ml="0px" fontSize="14px" fontFamily="Lato" isTruncated>
        {info.getValue()}
      </Text>
    ),
  }),
];
