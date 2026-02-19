import { Box } from "@chakra-ui/react";

export default function UserBoxComponent({ children, width = "100%" , minH = "100%"}: { children: React.ReactNode, width?: string, minH?: string }) {
  return (
    <Box border={'1px solid #B4D6DF'} borderRadius={'10px'} p={'24px'} w={width} bg={'white'} h={'100%'} minH={minH}>
      {children}
    </Box>
  );
}