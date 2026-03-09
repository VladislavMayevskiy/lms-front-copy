import { HStack, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { Menu } from "./Menu";
import { LogoutModal } from "./LogoutModal";
import Logo from "components/ui/logo";
import { tabs } from "constants/tabs";
import { authStore } from "stores/authStore";

const activeStyle = {
  textDecoration: "underline",
  textDecorationThickness: "1px",
  textUnderlineOffset: "6px",
  textDecorationColor: "#0070C1",
  color: "#0070C1",
};

export default function AdminHeader() {
  const user = authStore((store) => store.user);
  const role = user?.role || "CourseProvider";

  return (
    <HStack justify={"space-between"} px="60px" py="20px" bg="white" maxH={'120px'}>
      <HStack spacing="20px">
        <Logo />
        {tabs[role].map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
          >
            {({ isActive }) => (
              <Button
                variant="ghost"
                fontSize="20px"
                _hover={{ bg: "white" }}
                sx={isActive ? activeStyle : undefined}
              >
                {tab.label}
              </Button>
            )}
          </NavLink>
        ))}
      </HStack>
      {user && (
        <Menu
          user={user}
        />
      )}
      <LogoutModal />
    </HStack>
  );
}
