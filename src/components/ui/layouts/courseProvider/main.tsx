import type { PropsWithChildren } from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import AdminHeader from "components/shared/header/admin";

type Props = {
  containerProps?: BoxProps;
  pageProps?: BoxProps;
};

export const CourseProviderLayout = ({ children, containerProps, pageProps }: PropsWithChildren<Props>) => {
  return (
    <Box
      minH="100vh"
      bgColor="#F5F7F9"
      display="flex"
      flexDir="column"
      gap={5}
      pb={10}
      fontFamily={"Lato"}
      {...containerProps}
    >
      <AdminHeader />
      <Box
        mx={'60px'}
        gap={5}
        display={"flex"}
        flexDirection={"column"}
        {...pageProps}
      >
        {children}
      </Box>
    </Box>
  );
};
