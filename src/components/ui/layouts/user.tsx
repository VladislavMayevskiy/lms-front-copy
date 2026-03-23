import type { PropsWithChildren } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Image,
  useDisclosure,
  Divider,
  IconButton
} from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { queryClient } from "api";

import CoursesIcon from "assets/imgs/user/heroicons-outline/courses.svg?react";
import MyCoursesIcon from "assets/imgs/user/heroicons-outline/myCourses.svg?react";
import ProfileIcon from "assets/imgs/user/heroicons-outline/profile.svg?react";
import SettingsIcon from "assets/imgs/user/heroicons-outline/settings.svg?react";
import LogOutIcon from "assets/imgs/user/heroicons-outline/logout.svg?react";

import SidebarIcon from "assets/imgs/user/sidebar.svg?react";
import MenImage from "assets/imgs/men.png";
import { authStore } from "stores/authStore";

import { UserRoutes } from "constants/routes";
import { useCurrentUserQuery } from "api/global/hooks";
import { localStore } from "stores/localStore";
import { useTitleByPathname } from "hooks/admin/useTitleByPathname";
import { useTranslation } from "react-i18next";
import UserMenuDrawer from "components/shared/drawer";
import UserHeaderMobile from "components/shared/header/user/mobile";
import Logo from "components/ui/logo";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";

type Props = {
  title?: string;
};

export function UserBox({children} : PropsWithChildren<Props>) {
  // const { t } = useTranslation();
  const { pageTitle } = useTitleByPathname();
  const { pathname } = useLocation();
  const direction = localStore((store) => store.direction);
   const isStudentCoursePage = !!matchPath(
      UserRoutes.studentCourse,
      pathname
    );
  return (
    <Box
      p="24px"
      w={'100%'}
      dir={direction}
      bgColor="white"
      borderColor="#B4D6DF"
      borderWidth="1px"
      borderRadius="10px"
      className="lms-box min-w-60 md:min-w-6xl"
      >
      <HStack align={'flex-start'} width={'100%'}>
        <Text fontSize={'32px'} fontFamily={'Lato'}> 
          {!isStudentCoursePage ? pageTitle : "Student courses"}
          </Text>
      </HStack>
      {children}
    </Box>
  );
}


export default function UserLayout({ children }: PropsWithChildren<Props>) {
  const { t } = useTranslation();
  const { isOpen: isMenuOpen, onToggle, onClose } = useDisclosure();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { data: User } = useCurrentUserQuery();
  const direction = localStore((store) => store.direction);
  const navigate = useNavigate();
  const { user } = authStore();
  const teacherRole = user?.role === "Teacher"
  const toggleSidebar = () => setIsOpen((prev) => !prev);


  const menuItems = [
    { id: "Courses", icon: <CoursesIcon />, label: t("user.courses.title"), path: UserRoutes.courses },
    { id: "MyCourses", icon: <MyCoursesIcon />, label: t("user.myCourses.title"), path: UserRoutes.myCourses },
    { id: "Profile", icon: <ProfileIcon />, label: t("user.profile.title"), path: UserRoutes.profile },
    { id: "Settings", icon: <SettingsIcon />, label: t("user.settings.title"), path: UserRoutes.settings },

    ...(teacherRole
      ? [{ id: "Teacher", icon: <ProfileIcon/>, label: t("user.teacher.title", "Teacher"), path: UserRoutes.teacher }]
      : []),
  ] as const;

  const baseButtonStyle = {
    width: isOpen ? "205px" : "48px",
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

  const clearToken = localStore((store) => store.clearToken);

  const logout = useCallback(() => {
    clearToken();
    queryClient.clear();
    navigate("/login");
  }, [clearToken, navigate]);

  const sidebarW = isOpen ? "241px" : "96px";


  return (
    <Box bg="#F5F7F9" w="100%" minH="100vh" overflowX="hidden" dir={direction} className="flex flex-col md:flex-row">

      <Box
        bg="white"
        p="24px"
        h="100vh"
        transition="0.25s"
        width={sidebarW}
        overflowY="auto"
        overflowX="hidden"
        borderRight="1px solid #B4D6DF"
        position="fixed"
        top="0"
        left="0"
        zIndex={10}
        className="lms-box hidden md:block"
      >
        <VStack align="stretch" spacing={4}>
        <Box
          // width={isOpen ? "241px" : "96px"}
          height="48px"
          position="relative"
          transition="width 0.3s ease"
        >

        <HStack align="center" height="100%" px="8px" >
          <Logo />
          {/* <HStack spacing={isOpen ? 2 : 0}>
           <LogoIcon />

            {isOpen && (
              <Text
                color="#0070C1"
                fontWeight="extrabold"
                fontSize="22px"
                fontFamily="Lato"
                whiteSpace="nowrap"
              >
                COURSA
              </Text>
            )}
          </HStack> */}

        <IconButton
          aria-label="Toggle sidebar"
          icon={<SidebarIcon />}
          onClick={toggleSidebar}
          variant="ghost"
          position="absolute"
          right="-24px"
          top="50%"
          transform={`translateY(-50%) rotate(${isOpen ? 0 : 180}deg)`}
          transition="transform 0.35s cubic-bezier(.4,0,.2,1)"
          width="24px"
          height="42px"
          border="1px solid #B4D6DF"
          bg="white"
          borderRadius="5px"
          minW="0"
          zIndex={20}
          sx={{
            svg: {
              stroke: "#0070C1",
              fill: "none",
            },
          }}
        />
        </HStack>

          </Box>
          <Divider borderColor="#B4D6DF" w={'300px'} ml={'-30px'} />
          <VStack spacing={2} align="stretch">
            {menuItems.map((item) => (
              <NavLink key={item.id} to={item.path}>
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

          <VStack mt="270" spacing={3}>
            <HStack
              width={isOpen ? "204px" : "48px"}
              height="44px"
              justifyContent={isOpen ? "flex-start" : "center"}
              alignItems="center"
              px={isOpen ? "12px" : 0}
              spacing={isOpen ? 3 : 0}
              borderRadius="10px"
            >
              <Image
                width="32px"
                height="32px"
                bg="#E9ECEF"
                borderRadius="5px"
                src={User?.image ?? MenImage}
                fallbackSrc={MenImage}
                objectFit="cover"
                alt="Profile"
              />
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
        </VStack>
      </Box>

      <Box
        ml={sidebarW}
        w={isOpen ? "calc(100% - 241px)" : "calc(100% - 96px)"}
        minH="100vh"
        bg="#F5F7F9"
        p="32px"
        minW="0"
        className="lms-box hidden md:block"
      >
        {children}
      </Box>

      <UserHeaderMobile onToggle={onToggle} isOpen={isMenuOpen} />
      <Box flex="1" overflowY="auto" overflowX="hidden" className="lms-box md:hidden">
        <Outlet />
        <Box className="lms-box" p="16px">{children}</Box>
      </Box>
      <UserMenuDrawer isOpen={isMenuOpen} onClose={onClose} />
    </Box>
  );
}

