import { createColumnHelper } from "@tanstack/react-table";
import type { ApiCommunityType } from "api/admin/community/types";
// import Edit from "assets/imgs/admin/edit.svg?react";
import Delete from "assets/imgs/admin/trash.svg?react";
import { Box, HStack, Text, Image, Button } from "@chakra-ui/react";
import { useModalStore } from "stores/modalStore";

const columnHelper = createColumnHelper<ApiCommunityType>();


export const CommunityColums = [
  columnHelper.accessor("name", {
    header: "Name",
    filterFn: "includesString",
    cell: ({ row }) => {
      const school = row.original;

      return (
        <HStack>
          {school.logo && <Image src={school.logo} w="42px" h="42px" />}
          <Text fontSize="14px" fontFamily="Lato">
            {school.name}
          </Text>
        </HStack>
      );
    },
  }),

  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => (
      <Text ml="0px" fontSize="14px" fontFamily="Lato">
        {info.getValue()}
      </Text>
    ),
  }),

  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => (
      <Text ml="0px" fontSize="14px" fontFamily="Lato">
        {info.getValue()}
      </Text>
    ),
  }),

  columnHelper.accessor((row) => row.district?.name || "", {
    id: "districtName",
    header: "District",
    filterFn: "includesString",
    cell: (info) => (
      <Text ml="0px" fontSize="14px" fontFamily="Lato">
        {info.getValue() || "—"}
      </Text>
    ),
  }),

columnHelper.display({
  id: "actions",
  header: "Actions",
  cell: ({ row }) => {
    const school = row.original;

    return (
      <HStack justifyContent="flex-end">
        {/* <Button
          w="40px"
          h="40px"
          borderRadius="6px"
          borderWidth="1px"
          bg="white"
          borderColor="#B4D6DF"
          _hover={{ bgColor: "white" }}
          onClick={() =>
            useModalStore.getState().openModal("EDIT_ASSIGN_SCHOOL", {
              schoolId: school.id,
              districtId: school.district_id ?? undefined
            })
          }
        >
          <Box width="18px" height="18px">
            <Edit />
          </Box>
        </Button> */}

        <Button
          w="40px"
          h="40px"
          borderRadius="6px"
          borderWidth="1px"
          bg="#FFEFEF"
          borderColor="#FFB7B7"
          _hover={{ bgColor: "#FFEFEF" }}
          onClick={() =>
            useModalStore.getState().openModal("DELETE_ASSIGN_SCHOOL", {
              schoolId: school.id,
              districtId: school.district?.id,
            })
          }
        >
          <Box width="18px" height="18px">
            <Delete />
          </Box>
        </Button>
      </HStack>
    );
  },
})

];
