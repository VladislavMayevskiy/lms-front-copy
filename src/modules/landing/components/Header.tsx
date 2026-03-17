import { Button, Flex, HStack, Box } from "@chakra-ui/react";
import Logo from "components/ui/logo";
import { NavLink } from "react-router-dom";
import { AuthRoutes } from "constants/routes";

export default function Header() {
  return (
    <Flex
      maxW="1440px"
      mx="auto"
      align="center"
      justify="space-between"
      w="100%"
      px={{ base: "16px", md: "16px" }}
      py="16px"
      zIndex={2}
      sx={{ maxWidth: "100vw", boxSizing: "border-box" }}
      gap="12px"
    >
      <Box flexShrink={0}>
        <Logo />
      </Box>

      <HStack spacing="12px" flexWrap="wrap" justify="flex-end" flex="1" minW={0}>
        <Button
          as={NavLink}
          to={AuthRoutes.login}
          color="#0070C1"
          bgColor="white"
          borderRadius="12px"
          px={{ base: "14px", md: "24px" }}
          h="48px"
          fontSize="16px"
          border="1px solid #0070C1"
          _hover={{ bg: "#f0f7ff" }}
          flexShrink={0}
        >
          Log In
        </Button>

        <Button
          color="black"
          bgColor="white"
          borderRadius="12px"
          px={{ base: "14px", md: "24px" }}
          h="48px"
          fontSize="16px"
          _hover={{ bg: "white" }}
          flexShrink={0}
          onClick={() => {
            document.getElementById("contact-us-section")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
                });
            }}
        >
          Contact
        </Button>
      </HStack>
    </Flex>
  );
}