import { Box } from "@chakra-ui/react";
import Logo from "components/ui/logo";

export const AuthHeader = () => {
  return (
    <Box
      width="full"
      paddingY={5}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderBottom={1}
      borderColor={"#F5F7F9"}
      bgColor={"white"}
      boxShadow={"sm"}
      maxH={'120px'}
    >
      <Box>
        <Logo />
      </Box>
    </Box>
  );
};
