import { AdminLayout } from "components/ui/layouts/admin";
import DistrictModal from "./components/modals/district";
import DeleteDistrictModal from "./components/modals/district/delete";
import SchoolModal from "../schools/components/modals/school";

import { useGetDistricts } from "api/admin/districts/hooks";
import {
  getCoreRowModel,
  useReactTable,
  flexRender
} from "@tanstack/react-table";
import { DistrictsColumns } from "./constants/districtsTable";

import {
  Box,
  HStack,
  Text,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

import Sorting from "assets/imgs/admin/sorting.svg?react";
import Search from "assets/imgs/admin/search.svg?react";
// import Sort from "assets/imgs/filter/sort.svg?react";

import { useState,useEffect } from "react";
import { Spinner } from "components/ui/spinner";

type SortField = "name" | "schools_count" | null;
type SortDirection = "asc" | "desc" | null;

function AdminDistrics() {
  const [sort, setSort] = useState<{field: SortField; direction: SortDirection}>({field: null, direction: null,});
  const [search, setSearch] = useState("");
  const [apiSearch, setApiSearch] = useState<string | undefined>(undefined);

  const handleSort = (field: SortField) => {
    setSort((prev) => {
      if (prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return { field: null, direction: null };
    });
  };

  const apiSort =
    sort.field && sort.direction
      ? sort.direction === "desc"
        ? `-${sort.field}`
        : sort.field
      : undefined;

  const { districts, isLoading, isFetching } = useGetDistricts({sort: apiSort,search: apiSearch});


  const table = useReactTable({
    data: districts,
    columns: DistrictsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
  const timer = setTimeout(() => {
    setApiSearch(search.trim() || undefined);
  }, 300);

  return () => clearTimeout(timer);
}, [search]);


  return (
    <AdminLayout>
      <DistrictModal />
      <DeleteDistrictModal />
      <SchoolModal />

      <HStack justify="space-between" mb={4}>
        <Text fontFamily="Lato" fontWeight="500" fontSize="20px">
          {districts.length} Districts
        </Text>

        <HStack>
          <InputGroup w="320px">
            <InputLeftElement>
              <Search />
            </InputLeftElement>
            <Input placeholder="Search" fontFamily="Lato" onChange={(e) => setSearch(e.target.value)} />
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

      <Box h="56px" bg="#DDECF7" borderRadius="8px">
        <HStack px="20px" py="16px">
          <HStack
            w="full"
            cursor={isFetching ? "not-allowed" : "pointer"}
            pointerEvents={isFetching ? "none" : "auto"}
            onClick={() => handleSort("name")}
          >
            <Text>Name</Text>
            <Sorting
              style={{
                opacity: sort.field === "name" ? 1 : 0.4,
                transform:
                  sort.field === "name" && sort.direction === "desc"
                    ? "rotate(180deg)"
                    : "none",
                transition: "0.2s",
              }}
            />
          </HStack>

          <Text w="full">Phone</Text>
          <Text w="full">Email</Text>

          <HStack
            w="full"
            cursor={isFetching ? "not-allowed" : "pointer"}
            pointerEvents={isFetching ? "none" : "auto"}
            onClick={() => handleSort("schools_count")}
          >
            <Text># Of Schools</Text>
            <Sorting
              style={{
                opacity: sort.field === "schools_count" ? 1 : 0.4,
                transform:
                  sort.field === "schools_count" &&
                  sort.direction === "desc"
                    ? "rotate(180deg)"
                    : "none",
                transition: "0.2s",
              }}
            />
          </HStack>

          <Text w="full" textAlign="end">
            Actions
          </Text>
        </HStack>
      </Box>

      <VStack spacing="6px" mt="5px">
        {isLoading && <Spinner isLoading={isLoading} />}

        {table.getRowModel().rows.map((row) => (
          <Box
            key={row.id}
            px="20px"
            py="10px"
            w="full"
            h="62px"
            bg="white"
            border="1px solid #D7E8EE"
            borderRadius="8px"
          >
            <HStack>
              {row.getVisibleCells().map((cell) => (
                <Box key={cell.id} w="full">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </Box>
              ))}
            </HStack>
          </Box>
        ))}
      </VStack>
    </AdminLayout>
  );
}

export default AdminDistrics;
