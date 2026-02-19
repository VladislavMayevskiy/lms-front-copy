import { createColumnHelper } from "@tanstack/react-table";
import type { ApiUsersType } from "api/admin/users/types"
import Edit from "assets/imgs/admin/edit.svg?react";
import Visible from "assets/imgs/admin/visible.svg?react";
import Delete from "assets/imgs/admin/trash.svg?react";
import { HStack, Text, Button ,Box} from "@chakra-ui/react";
import { useModalStore   } from "stores/modalStore";
import { RolesByNumber } from "constants/roles";
import { NavLink } from "react-router-dom";
import { SchoolAdminRoutes } from "constants/routes";
const columnHelper = createColumnHelper<ApiUsersType>();


export const SchoolAdminUsersColumns = [
  columnHelper.accessor("name", {
    header: "User",
    filterFn: "includesString",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Text fontSize="14px" fontFamily="Lato">
          {`${user.first_name} ${user.last_name}`}
        </Text>
      );
    },
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: info => (
      <Text fontSize="14px" fontFamily="Lato">
        {info.getValue() as string}
      </Text>
    ),
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      const roleLabel = RolesByNumber[user.role];
      return (
        <Text fontSize="14px" fontFamily="Lato">
          {roleLabel}
        </Text>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const openModal = useModalStore((state) => state.openModal);
      const user = row.original;

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
            onClick={() => openModal("EDIT_USER", { id:user.id, data: user})}
          >
            <Box>
              <Edit width="20px" height="20px" />
            </Box>
          </Button>

          <Button
            as={NavLink}
            to={`${SchoolAdminRoutes.users}/${user.id}`}
            w="40px"
            h="40px"
            borderRadius="6px"
            borderWidth="1px"
            bg="white"
            borderColor="#FCE0B5"
            _hover={{ bgColor: "white" }}
          >
            <Box>
              <Visible width="20px" height="20px" />
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
            onClick={() => openModal("DELETE_USER",{id:user.id, data: user})}
          >
            <Box>
              <Delete width="20px" height="20px" />
            </Box>
          </Button>
        </HStack>
      );
    },
  }),
];
