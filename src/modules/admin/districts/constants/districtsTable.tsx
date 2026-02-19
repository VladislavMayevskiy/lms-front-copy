import { createColumnHelper } from "@tanstack/react-table";
import type { ApiDistrictType } from "api/admin/districts/types";
import Edit from "assets/imgs/admin/edit.svg?react";
import Delete from "assets/imgs/admin/trash.svg?react";
import { Box, HStack, Text, Image, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { AdminRoutes } from "constants/routes";
import { useModalStore } from "stores/modalStore";

const columnHelper = createColumnHelper<ApiDistrictType>();

export const DistrictsColumns = [
  columnHelper.accessor("name", {
    header: "District",
    filterFn: "includesString",
    cell: ({ row }) => {
      const district = row.original;

      return (
        <HStack>
          {district.logo && (
            <Image src={district.logo} w="42px" h="42px" />
          )}

          <Text fontSize="14px" fontFamily="Lato">
            {district.name}
          </Text>
        </HStack>
      );
    },
  }),

  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => (
      <Text fontSize="14px" fontFamily="Lato">
        {info.getValue()}
      </Text>
    ),
  }),

  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => (
      <Text fontSize="14px" fontFamily="Lato" isTruncated>
        {info.getValue()}
      </Text>
    ),
  }),

  columnHelper.accessor("schools_count", {
    header: "Schools",
    cell: ({ row }) => {
      const district = row.original;

      return (
        <NavLink to={`${AdminRoutes.districts}/${district.id}`}>
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            color="#0070C1"
            fontSize="14px"
            px="18px"
            py="8px"
            bgColor="#F5F7F9"
            fontFamily="Lato"
            borderRadius="30px"
            border="1px solid #C7C7C7"
            cursor="pointer"
            width="86px"
            height="32px"
            whiteSpace="nowrap"
          >
            {district.schools_count} schools
          </Box>
        </NavLink>
      );
    },
  }),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const openModal = useModalStore ((state) => state.openModal);
      const district = row.original;

      return (
        <HStack justifyContent={"flex-end"}>
          <Button
            w="40px"
            h="40px"
            borderRadius="6px"
            borderWidth="1px"
            bg="white"
            _hover={{ bgColor: "white" }}
            borderColor="#B4D6DF"
            onClick={() =>
              openModal("EDIT_DISTRICT", {
                id: district.id,
                data: district,
              })
            }
          >
            <Box>
              <Edit width={'20px'} height={'20px'}/>
            </Box>
          </Button>

          <Button
            w="40px"
            h="40px"
            borderRadius="6px"
            borderWidth="1px"
            bg="#FFEFEF"
            borderColor="#FFB7B7"
            _hover={{ bgColor: "#FFEFEF" }}
            onClick={() =>
              openModal("DELETE_DISTRICT", { id: district.id })
            }
          >
            <Box>
              <Delete width={'20px'} height={'20px'}/>
            </Box>
          </Button>
        </HStack>
      );
    },
  }),
];
