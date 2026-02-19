import type { PropsWithChildren } from "react";
import {
  Box,
  Card,
  CardBody,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import AdminHeader from "components/shared/header/admin";
import { useTitleByPathname } from "hooks/admin/useTitleByPathname";
import { useLocation, NavLink } from "react-router-dom";
import { AdminRoutes } from "constants/routes";
import { SchoolAdminRoutes } from "constants/routes";
import { matchPath } from "react-router-dom";
import BackIcon from "assets/imgs/admin/back.svg?react";
import Edit from "assets/imgs/admin/edit.svg?react";
import Delete from "assets/imgs/admin/trash.svg?react";
import { useCreateModal } from "hooks/admin/useCreateModal";


type Props = {
  title?: string;
};

export const AdminLayout = ({ children, title }: PropsWithChildren<Props>) => {
  const { pageTitle } = useTitleByPathname();

  const { pathname } = useLocation();
  const ModalOpen = useCreateModal(pathname);

  const finalTitle = title || pageTitle;

  const isCommunityPage = !!matchPath(
    `${AdminRoutes.districts}/:districtId`,
    pathname
  );
  const isSchoolBillingPage = !!matchPath(
    `${SchoolAdminRoutes.billing}`,
    pathname
  );

  const isUserInfoPage = !!matchPath(
    `${AdminRoutes.users}/:userId`,
    pathname
  );

  const isSchoolUserInfoPage = !!matchPath(
    `${SchoolAdminRoutes.users}/:userId`,
    pathname
  );
  const isDashboardPage = !!matchPath(
    AdminRoutes.dashboard,
    pathname
  );
  const isSchoolAdminDashboardPage = !!matchPath(
    SchoolAdminRoutes.dashboard,
    pathname
  );

  return (
    <Box
      minH="100vh"
      bgColor="#F5F7F9"
      display="flex"
      flexDir="column"
      gap={8}
      pb={10}
      fontFamily={"Lato"}
    >
      <AdminHeader />

      <Box
        minH="100vh"
        bgColor="#F5F7F9"
        display="flex"
        flexDir="column"
        gap={8}
        pb={10}
        px="60px"
        fontFamily={"Lato"}
      >
        <HStack>
          {isCommunityPage && (
            <NavLink to={AdminRoutes.districts}>
              <Button
                fontWeight={"medium"}
                leftIcon={<BackIcon />}
                variant="ghost"
                padding={0}
              >
                Back
              </Button>
            </NavLink>
          )}
           {isUserInfoPage && (
            <NavLink to={AdminRoutes.users}>
              <Button
                fontWeight={"medium"}
                leftIcon={<BackIcon />}
                variant="ghost"
                padding={0}
              >
                Back
              </Button>
            </NavLink>
          )}
        </HStack>

        <HStack justify={"space-between"}>
          <Text fontSize={"32px"}>{finalTitle}</Text>
{!isDashboardPage && !isUserInfoPage && !isCommunityPage && !isSchoolBillingPage && !isSchoolAdminDashboardPage && !isSchoolUserInfoPage && (
  <Button
    onClick={ModalOpen}
    borderRadius="10px"
    bgColor="#0070C1"
    _hover={{ bgColor: "#0070C1" }}
    textColor="white"
    width="179px"
    height="44px"
  >
    {`+ Create ${pageTitle.toLowerCase()}`}
  </Button>
)}

          {isUserInfoPage && (
        <HStack justifyContent={"flex-end"} spacing={'14px'}>
          <Button
            w="40px"
            h="40px"
            borderRadius="6px"
            borderWidth="1px"
            bg="white"
            _hover={{ bgColor: "white" }}
            borderColor="#B4D6DF"
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
          >
            <Box>
              <Delete width={'20px'} height={'20px'}/>
            </Box>
          </Button>
        </HStack>
          )}
        </HStack>
    {!isUserInfoPage ? (
        <Card
          // w={"1320px"}
          w="full"
          minH={"708px"}
          // mx="auto"
          borderRadius="20px"
          bg="white"
          borderColor={"#B4D6DF"}
          borderWidth={"1px"}
        >
          <CardBody p="24px">
            {children}
          </CardBody>
        </Card>
        ) : (
        children
        )}
      </Box>
    </Box>
  );
};
