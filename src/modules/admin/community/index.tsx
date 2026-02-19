import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "components/ui/layouts/admin";
import { useGetSchoolsByDistrict } from "api/admin/community/hooks";
import {
  Box,
  Text,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import { Spinner } from "components/ui/spinner";
import { useParams } from "react-router-dom";
import { CommunityColums } from "./constants/communityTable";
import Sorting from "assets/imgs/admin/sorting.svg?react";
import Search from "assets/imgs/admin/search.svg?react";
import { useModalStore } from "stores/modalStore";
import CommunityModal from "./components/modals";
import EditSchoolFromDistrictModal from "./components/modals/edit";
import RemoveSchoolFromDistrictModal from "./components/modals/delete";
import { MainButton } from "components/ui/button";

type SchoolSort =
  | "name"
  | "-name"
  | "district.name"
  | "-district.name"
  | "phone"
  | "-phone"
  | "email"
  | "-email";

function AdminCommunity() {
  const { districtId } = useParams();
  const districtIdNumber = Number(districtId);

  const { openModal } = useModalStore();

  const [search, setSearch] = useState("");
  const [apiSearch, setApiSearch] = useState<string | undefined>(undefined);

  const [sort, setSort] = useState<SchoolSort | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setApiSearch(search.trim() || undefined);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const { schools = [], isLoading} = useGetSchoolsByDistrict(
    districtIdNumber,
    { search: apiSearch, sort }
  );

  const toggleSort = (field: Exclude<SchoolSort, `-${string}`>) => {
    setSort((prev) => {
      if (prev === field) return (`-${field}` as SchoolSort);
      if (prev === (`-${field}` as SchoolSort)) return undefined;
      return field as SchoolSort;
    });
  };

  const currentSchoolIds = useMemo(() => schools.map((s) => s.id), [schools]);

  const table = useReactTable({
    data: schools,
    columns: Array.isArray(CommunityColums) ? CommunityColums : [],
    getCoreRowModel: getCoreRowModel(),
  });

  if (!districtIdNumber) {
    return (
      <AdminLayout>
        <Text>District not found</Text>
      </AdminLayout>
    );
  }


  return (
    <AdminLayout title="Community Academics Association Prime District">
      <CommunityModal />
      <RemoveSchoolFromDistrictModal />
      <EditSchoolFromDistrictModal />

      <HStack justify="space-between" mb={4}>
        <Text fontFamily="Lato" fontWeight="medium" fontSize="20px">
          {schools.length} Schools
        </Text>

        <HStack>
          <InputGroup width="320px">
            <InputLeftElement>
              <Search />
            </InputLeftElement>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <MainButton
            onClick={() =>
              openModal("ASSIGN_SCHOOL", {
                districtId: districtIdNumber,
                currentSchoolIds,
              })
            }
          >
            + Add school
          </MainButton>
        </HStack>
      </HStack>

      <Box mb={4} width="full" height="56px" bgColor="#DDECF7" borderRadius="8px">
        <HStack px="20px" py="16px">
          <HStack
            width="full"
            cursor="pointer"
            userSelect="none"
            onClick={() => toggleSort("name")}
          >
            <Text fontFamily="Lato" fontSize="16px" color="#434645">
              Name
            </Text>
            <Sorting />
          </HStack>

          <Text width="full" fontFamily="Lato" fontSize="16px" color="#434645">
            Phone
          </Text>

          <Text width="full" fontFamily="Lato" fontSize="16px" color="#434645">
            Email
          </Text>

          <HStack
            width="full"
            cursor="pointer"
            userSelect="none"
          >
            <Text fontFamily="Lato" fontSize="16px" color="#434645">
              District
            </Text>
          </HStack>

          <Text
            fontFamily="Lato"
            fontSize="16px"
            color="#434645"
            w="full"
            textAlign="end"
          >
            Actions
          </Text>
        </HStack>
      </Box>
    <Box position="relative">
    {(isLoading) && (
    <Box
      inset={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(255,255,255,0.6)"
      zIndex={10}
      borderRadius="8px"
    >
      <Spinner isLoading />
    </Box>
  )}
      <VStack spacing="6px" mt="5px">
        {table.getRowModel().rows.map((row) => (
          <Box
            key={row.id}
            px="20px"
            py="10px"
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
                <Box key={cell.id} w="full">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>
              ))}
            </HStack>
          </Box>
        ))}
      </VStack>
      </Box>
    </AdminLayout>
  );
}

export default AdminCommunity;
