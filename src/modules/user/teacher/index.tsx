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
import { useNavigate } from "react-router-dom";
import { Spinner } from "components/ui/spinner";
import { StudentsColumn } from "./constants/studentsTable";
import Sorting from "assets/imgs/admin/sorting.svg?react";
import Search from "assets/imgs/admin/search.svg?react";
import UserLayout from "components/ui/layouts/user";
import { useGetStudents } from "api/user/hooks";
import { UserRoutes } from "constants/routes";
import { useState, useEffect } from "react";

type SortDirection = "asc" | "desc" | null;

function Teacher() {
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [search, setSearch] = useState("");
  const [apiSearch, setApiSearch] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleSort = () => {
    setSortDirection((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setApiSearch(search.trim() || undefined);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const apiSort = sortDirection === "desc" ? "-name" : sortDirection === "asc" ? "name" : undefined;

  const { data , isLoading, isFetching } = useGetStudents(apiSort, apiSearch);
  const students = data?.data ?? [];

  const table = useReactTable({
  data: students,
  columns: Array.isArray(StudentsColumn) ? StudentsColumn : [],
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
          {table.getFilteredRowModel().rows.length} Students
        </Text>

        <HStack>
          
          <InputGroup width={"320px"}>
            <InputLeftElement>
              <Search />
            </InputLeftElement>
            <Input
              placeholder="Search"
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

      <Box mb={4} width="full" height="56px" bgColor="#DDECF7" borderRadius="8px">
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
            Phone
          </Text>

          <Text width="full" fontFamily="Lato" fontSize="16px" color="#434645">
            Email
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
              <Box key={cell.id} w="full" onClick={() => navigate(UserRoutes.studentCourse.replace(":id",String(row.original.id) ))}>
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

export default Teacher;
