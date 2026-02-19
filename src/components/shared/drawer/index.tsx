
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  VStack,
  HStack,
  Text,
  Image,
  Divider,
  Button
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserRoutes } from "constants/routes";
import { useCallback } from "react";
import { localStore } from "stores/localStore";
import { queryClient } from "api";
import { useTranslation } from "react-i18next";

import CoursesIcon from "assets/imgs/user/heroicons-outline/courses.svg?react";
import MyCoursesIcon from "assets/imgs/user/heroicons-outline/myCourses.svg?react";
import ProfileIcon from "assets/imgs/user/heroicons-outline/profile.svg?react";
import SettingsIcon from "assets/imgs/user/heroicons-outline/settings.svg?react";
import BillingIcon from "assets/imgs/user/heroicons-outline/billing.svg?react";
import LogOutIcon from "assets/imgs/user/heroicons-outline/logout.svg?react";

import { useCurrentUserQuery } from "api/global/hooks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
};

export default function UserMenuDrawer({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const clearToken = localStore((store) => store.clearToken);
  const { data: User } = useCurrentUserQuery();

  const logout = useCallback(() => {
    clearToken();
    queryClient.clear();
    navigate("/login");
  }, [clearToken, navigate]);

  const menuItems = [
    { icon: <CoursesIcon />, label: t("user.courses.title"), path: UserRoutes.courses },
    { icon: <MyCoursesIcon />, label: t("user.myCourses.title"), path: UserRoutes.myCourses },
    { icon: <ProfileIcon />, label: t("user.profile.title"), path: UserRoutes.profile },
    { icon: <SettingsIcon />, label: t("user.settings.title"), path: UserRoutes.settings },
    { icon: <BillingIcon />, label: t("user.billing.header"), path: UserRoutes.billing },
  ];

  const baseButtonStyle = {
    width: '100%',
    height: "44px",
    justifyContent: isOpen ? "flex-start" : "center",
    px: isOpen ? "12px" : 0,
    iconSpacing: isOpen ? 3 : 0,
    fontFamily: "Lato",
    borderRadius: "10px",
    _hover: { bgColor: "#F5F7F9" },
  };

  const activeButtonStyle = {
    bg: "#DDECF7",
    border: "1px solid #0070C1",
    color: "#0070C1",
    borderRadius: "10px",
    _hover: { bgColor: "#DDECF7" },
  };

  const activeIconSx = {
    svg: {
      color: "#0070C1",
      fill: "#0070C1 !important",
    },
    "svg path": {
      stroke: "#DDECF7 !important",
      fill: "#0070C1 !important",
    },
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
      <DrawerContent className="lms-box" bg="white" mt={'72px'}>
        <DrawerBody p="0">

          <VStack align="stretch" p="20px" spacing="12px">
            {menuItems.map(item => (
              <NavLink key={item.path} to={item.path} onClick={onClose}>
                {({ isActive }) => (
                  <Button
                    leftIcon={item.icon}
                    {...baseButtonStyle}
                    {...(isActive ? activeButtonStyle : {})}
                    sx={isActive ? activeIconSx : undefined}
                    variant={"ghost"}
                    className={isActive ? "lms-sidebar-active" : "lms-svg-outline"}
                    
                  >
                    {isOpen && item.label}
                  </Button>
                )}
              </NavLink>
            ))}
          </VStack>

          <Divider />

          <VStack p="20px" spacing={3} w={'100%'} align={'flex-start'}>
            <HStack
              width={isOpen ? "204px" : "48px"}
              height="44px"
              justifyContent={isOpen ? "flex-start" : "center"}
              alignItems="center"
              px={isOpen ? "12px" : 0}
              spacing={isOpen ? 3 : 0}
              borderRadius="10px"
            >
              <Image width="32px" height="32px" bg="#E9ECEF" borderRadius="5px" />
              {isOpen && (
                <Text>
                  {User?.first_name} {User?.last_name}
                </Text>
              )}
            </HStack>

            <Button
              variant="ghost"
              leftIcon={<LogOutIcon />}
              {...baseButtonStyle}
              onClick={logout}
              className="lms-svg-outline"
            >
              {isOpen && t("general.logOut")}
            </Button>
          </VStack>

        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
