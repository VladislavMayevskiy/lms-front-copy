import { createColumnHelper } from "@tanstack/react-table";
import type { ApiSchoolType } from "api/admin/schools/types";
import Edit from "assets/imgs/admin/edit.svg?react";
import Delete from "assets/imgs/admin/trash.svg?react";
import { Box, HStack, Text, Button , Image} from "@chakra-ui/react";
import { useModalStore } from "stores/modalStore";

const columnHelper = createColumnHelper<ApiSchoolType>();

export const SchoolsColumns = [
  columnHelper.accessor("name", {
    header: "School",
    filterFn: "includesString",
    cell: ({ row }) => {
      const school = row.original;

      return (
        <HStack>
          {school.logo && (
            <Image src={school.logo} w="42px" h="42px" />
          )}

          <Text fontSize="14px" fontFamily="Lato">
            {school.name}
          </Text>
        </HStack>
      );
    },
  }),

  columnHelper.accessor("phone", {
    header: "Phone",
    cell: info => (
      <Text fontSize="14px" fontFamily="Lato">
        {info.getValue()}
      </Text>
    ),
  }),

  columnHelper.accessor("email", {
    header: "Email",
    cell: info => (
      <Text fontSize="14px" fontFamily="Lato">
        {info.getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor("district", {
    header: "District",
    cell: ({ row }) => (
      <Text fontSize="14px" fontFamily="Lato">
        {row.original.district?.name ?? "—"}
      </Text>
    ),
  }),
 columnHelper.display({
  id: "actions",
  header: "Actions",
  cell: ({ row }) => {
    const school = row.original;
    const openModal = useModalStore (state => state.openModal);

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
            openModal(
              "EDIT_SCHOOL",
              {
                id: school.id,
                districtId: school.district?.id,
                data: school,
              }
            )
          }
        >
          <Box>
            <Edit width="20px" height="20px" />
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
            openModal(
              "DELETE_SCHOOL",
              { id: school.id }
            )
          }
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
