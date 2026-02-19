import { Box } from "@chakra-ui/react";

export default function UserInfoBox({ children }: { children: React.ReactNode }) {
  return (
    <Box
      border={'1px solid #CAE0C3'}
      borderRadius={'6px'}
      p={'12px'}
      w={'100%'}
      minW="0"
      h={'48px'}
      noOfLines={1}
    >
      {children}
    </Box>
  );
}