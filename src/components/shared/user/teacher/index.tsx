import { UserBox } from "components/ui/layouts/user";
import {
  Box,
  Text,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  VStack
} from "@chakra-ui/react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender
} from "@tanstack/react-table";

import { useTeacherStudentCourses } from "api/user/hooks";
import { Spinner } from "components/ui/spinner";
import { StudentsCourseColumn } from "./constants/studentsCourseTable";
import Sorting from "assets/imgs/admin/sorting.svg?react";
import Search from "assets/imgs/admin/search.svg?react";
import UserLayout from "components/ui/layouts/user";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserRoutes } from "constants/routes";
import { useState } from "react";

type SortDirection = "asc" | "desc" | null;

function StudentsCourse() {
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);

  const handleSort = () => {
    setSortDirection((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const { data, isLoading, isFetching } = useTeacherStudentCourses(studentId);

  const rawCourses = data?.data ?? [];
  const filtered = rawCourses
    .filter((c) =>
      search.trim()
        ? c.name.toLowerCase().includes(search.trim().toLowerCase())
        : true,
    )
    .sort((a, b) => {
      if (sortDirection === "asc") return a.name.localeCompare(b.name);
      if (sortDirection === "desc") return b.name.localeCompare(a.name);
      return 0;
    });
  const studentsCourse = filtered;

  const table = useReactTable({
  data: studentsCourse,
  columns: Array.isArray(StudentsCourseColumn) ? StudentsCourseColumn : [],
  getCoreRowModel: getCoreRowModel(),
});


  if (isLoading) {
    return (
      <UserLayout>
        <Spinner isLoading={isLoading} />
      </UserLayout>
    );
  }

  return (
    
    <UserLayout title="Community Academics Association Prime District">
      <UserBox>
      <HStack justify="space-between" mb={4}>
        <Text fontFamily="Lato" fontWeight="medium" fontSize="20px">
          {table.getFilteredRowModel().rows.length} Courses
        </Text>

        <HStack>
          
          <InputGroup width={"320px"}>
            <InputLeftElement>
              <Search />
            </InputLeftElement>
            <Input
              placeholder="Search"
              maxLength={12}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          {/* <Button
            bg="#F5F7F9"
            border="1px solid #B4D6DF"
            borderRadius="6px"
            h="40px"
            w="101px"
            leftIcon={<Sort />}
            textColor="#0070C1"
          >
            Filter
          </Button> */}
        </HStack>
      </HStack>

      <Box
        mb={4}
        width="full"
        height="56px"
        bgColor="var(--brand-secondary, #DDECF7)"
        borderRadius="8px"
      >
        <HStack px="20px" py="16px">
          <HStack 
            width="full"
            cursor={isFetching ? "not-allowed" : "pointer"}
            pointerEvents={isFetching ? "none" : "auto"}
            onClick={handleSort}
          >
            <Text fontFamily="Lato" fontSize="16px" color="#434645">
              Name
            </Text>
            <Sorting 
              style={{
                opacity: sortDirection ? 1 : 0.4,
                transform: sortDirection === "desc" ? "rotate(180deg)" : "none",
                transition: "0.2s",
              }}
            />
          </HStack>



          <Text width="full" fontFamily="Lato" fontSize="16px" color="#434645">
            Instructor
          </Text>

        </HStack>
      </Box>

      <VStack spacing="6px" mt="5px">
      {table.getRowModel().rows.map((row) => (
        <Box
          key={row.id}
          px="20px"
          py="20px"
          width="full"
          height="62px"
          bgColor="white"
          borderColor="#D7E8EE"
          borderWidth="1px"
          borderRadius="8px"
          ml={-1}
        >
          <HStack justify="space-between">
            {row.getVisibleCells().map((cell) => (
              <Box
                key={cell.id}
                w="full"
                minW={0}
                overflow="hidden"
                cursor="pointer"
                onClick={() => navigate(UserRoutes.quiz.replace(":id", String(studentId)).replace(":courseId", String(row.original.id)))}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
          </HStack>
        </Box>
      ))}
      </VStack>
      </UserBox>
    </UserLayout>
  );
}

export default StudentsCourse;