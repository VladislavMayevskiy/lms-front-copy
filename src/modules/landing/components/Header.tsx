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
      width="100%"
      px={{ base: "16px", md: "16px" }}
      py="16px"
      zIndex={2}
      sx={{
        maxWidth: "100vw",
        boxSizing: "border-box"
      }}
    >
      <Box >
        <Logo />
      </Box>

      
      <HStack spacing="12px" flexShrink={0}>
        <Button 
          as={NavLink}
          to={AuthRoutes.login}
          color="#0070C1" 
          bgColor="white" 
          borderRadius="12px"
          px="24px"
          height="48px"
          fontSize="16px"
          border="1px solid #0070C1"
          _hover={{ bg: "#f0f7ff" }} 
          zIndex={1}
          flexShrink={0}
        >
          Log In
        </Button>
        <Button 
          color="black" 
          bgColor="white" 
          borderRadius="12px"
          px="24px"
          height="48px"
          fontSize="16px"
          _hover={{ bg: "white" }} 
          zIndex={1}
          flexShrink={0}
        >
          Contact
        </Button>
      </HStack>
    </Flex>
  );
};
