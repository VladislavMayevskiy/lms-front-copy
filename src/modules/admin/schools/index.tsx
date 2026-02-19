import { AdminLayout } from "components/ui/layouts/admin";
import { useGetSchools } from "api/admin/schools/hooks";
import { getCoreRowModel, useReactTable, flexRender, getFilteredRowModel } from "@tanstack/react-table";
import { SchoolsColumns } from "./constants/schoolTables";
import { Box, HStack, Text, VStack, Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import Search from "assets/imgs/admin/search.svg?react";
import Sorting from "assets/imgs/admin/sorting.svg?react";
// import Sort from "assets/imgs/filter/sort.svg?react"
import SchoolModal from "./components/modals/school";
import DeleteSchoolModal from "./components/modals/school/delete";
import { Spinner } from "components/ui/spinner";

function AdminSchools() {
  const { data, isLoading } = useGetSchools();

  const schools = data?.data || [];

  const table = useReactTable({
    data: schools,
    columns: SchoolsColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <AdminLayout>
      <SchoolModal/>
      <DeleteSchoolModal/>
      <HStack justify="space-between" mb={4}>
        <Text fontFamily="Lato" textColor="#434645" fontWeight="medium"  fontSize="20px">
          {table.getFilteredRowModel().rows.length} Schools
        </Text>
      <HStack>
        <InputGroup w="320px">
          <InputLeftElement>
            <Search />
          </InputLeftElement>
          <Input
            placeholder="Search"
            onChange={(e) => table.setGlobalFilter(e.target.value)}
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
          <Box mb={1} height={"56px"} bgColor={"#DDECF7"} borderRadius={"8px"}>
            <HStack px={"20px"} py={"16px"}>
              <HStack width={"full"}>
                <Text fontFamily={"Lato"} fontSize={"16px"} textColor={"#434645"}>
                  Name
                </Text>
                <Sorting />
              </HStack>

              <Text width={"full"} fontFamily={"Lato"} fontSize={"16px"} textColor={"#434645"}>
                Phone
              </Text>

              <Text width={"full"} fontFamily={"Lato"} fontSize={"16px"} textColor={"#434645"}>
                Email
              </Text>

              <HStack width={"full"}>
                <Text fontFamily={"Lato"} fontSize={"16px"} textColor={"#434645"}>
                  District
                </Text>
                <Sorting />
              </HStack>

              <Text fontFamily={"Lato"} fontSize={"16px"} textColor={"#434645"} width={"full"} textAlign={"end"}>
                Actions
              </Text>
            </HStack>
          </Box>
      <VStack spacing="6px">
        {isLoading && <Spinner isLoading={isLoading} />}

        {table.getRowModel().rows.map(row => (
          <Box key={row.id} px={"20px"} py={"10px"} width={"full"} height={"62px"} bgColor={"white"} borderColor={"#D7E8EE"} borderWidth={"1px"} borderRadius={"8px"}>
            <HStack >
              {row.getVisibleCells().map(cell => (
                <Box key={cell.id} w="full">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>
              ))}
            </HStack>
          </Box>
        ))}
      </VStack>
    </AdminLayout>
  );
}

export default AdminSchools;
