import type { PropsWithChildren } from "react";
import {
  Box,
  Card,
  CardBody,
  HStack,
  Text,
} from "@chakra-ui/react";
import AdminHeader from "components/shared/header/admin";
import { useTitleByPathname } from "hooks/admin/useTitleByPathname";
import { useLocation} from "react-router-dom";
import { AdminRoutes } from "constants/routes";
import { matchPath } from "react-router-dom";
import CommunityModal from "modules/admin/community/components/modals";

type Props = {
  title?: string;
};

export const AdminSettingsLayout = ({ children, title }: PropsWithChildren<Props>) => {
  const { pageTitle } = useTitleByPathname();

  const { pathname } = useLocation();

  const finalTitle = title || pageTitle;

  const isCommunityPage = !!matchPath(
    `${AdminRoutes.districts}/:districtId`,
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

      <HStack justify={"space-between"} w={"1320px"} ml={"60px"}>
        <Text fontSize={"32px"}>{finalTitle}</Text>

      </HStack>

      <Card
        w={"1320px"}
        minH={"507px"}
        mx="auto"
        borderRadius="20px"
        bg="white"
      >
        <CardBody p="32px">
          {isCommunityPage && <CommunityModal />}
          {children}
        </CardBody>
      </Card>
    </Box>
  );
};
