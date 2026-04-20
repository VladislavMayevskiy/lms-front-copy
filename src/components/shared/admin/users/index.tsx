import { AdminLayout } from "components/ui/layouts/admin";
import { UsersColumns } from "./constants/usersTable";
import { useGetUsers } from "api/admin/users/hooks";
import { getCoreRowModel, useReactTable, flexRender} from "@tanstack/react-table";
import { Box, HStack, Text, VStack, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import UserModal from "./components/modals";
import Search from "assets/imgs/admin/search.svg?react";
import Sorting from "assets/imgs/admin/sorting.svg?react";
// import Sort from "assets/imgs/filter/sort.svg?react"
import DeleteUsersModal from "./components/modals/delete";
import { Spinner } from "components/ui/spinner";
import { useState, useEffect, useMemo } from "react";

type SortField = "name" | "email" | null;
type SortDirection = "asc" | "desc" | null;

type Props = {
  filter?: { [key: string]: string };
}

function AdminUsers ({ filter }: Props) {
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

  const queryParams = useMemo(() => {
    return {
      sort: apiSort,
      search: apiSearch,
      filter,
    };
  }, [apiSort, apiSearch, filter]);
  const { data, isLoading, isFetching } = useGetUsers(queryParams);
  const users = data?.data || [];
  const table = useReactTable({
    data: users,
    columns: UsersColumns,
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
      <UserModal/>
      <DeleteUsersModal/>
      <HStack justify="space-between" mb={4}>
        <Text fontFamily="Lato" textColor="#434645" fontWeight="medium"  fontSize="20px">
          {table.getFilteredRowModel().rows.length} Users
        </Text>
      <HStack>
        <InputGroup w="320px">
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
      <Box
        mb={1}
        height={"56px"}
        bgColor={"var(--brand-secondary, #DDECF7)"}
        borderRadius={"8px"}
      >
        <HStack px={"20px"} py={"16px"}>
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
          <Text width={"full"} fontFamily={"Lato"} fontSize={"16px"} textColor={"#434645"}>
            Phone Number
          </Text>

          <HStack
            w="full"
            cursor={isFetching ? "not-allowed" : "pointer"}
            pointerEvents={isFetching ? "none" : "auto"}
            onClick={() => handleSort("email")}
          >
            <Text>Email</Text>
            <Sorting
              style={{
                opacity: sort.field === "email" ? 1 : 0.4,
                transform:
                  sort.field === "email" && sort.direction === "desc"
                    ? "rotate(180deg)"
                    : "none",
                transition: "0.2s",
              }}
            />
          </HStack>

          <Text width={"full"} fontFamily={"Lato"} fontSize={"16px"} textColor={"#434645"}>
            Role
          </Text>


          <Text fontFamily={"Lato"} fontSize={"16px"} textColor={"#434645"} width={"full"} textAlign={"right"} >
            Actions
          </Text>
        </HStack>
      </Box>
      <VStack spacing="6px">
       {isLoading && <Spinner isLoading={isLoading} />}

        {table.getRowModel().rows.map(row => (
          <Box key={row.id} w="full" px={"20px"} py={"10px"} height={"62px"} bgColor={"white"} borderColor={"#D7E8EE"} borderWidth={"1px"} borderRadius={"8px"}>
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
};

export default AdminUsers;