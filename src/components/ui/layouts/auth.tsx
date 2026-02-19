import type { PropsWithChildren } from "react";
import { Box, Heading, Card, CardBody } from "@chakra-ui/react";
import { AuthHeader } from "components/shared/header/auth";

type Props = {
  title: string;
};

export const AuthLayout = ({ title, children }: PropsWithChildren<Props>) => {
  return (
    <Box
      minHeight={"100vh"}
      bgColor={"#F5F7F9"}
      gap={20}
      pb={20}
      display="flex"
      flexDir={"column"}
    >
      <AuthHeader />
      <Card
        maxW={662}
        height={"full"}
        padding={30}
        borderRadius={50}
        bgColor={"white"}
        boxShadow={"2xl"}
        marginX="auto"
        minWidth={{md: "500px"}}
      >
        <CardBody>
          <Heading
            fontFamily="Lato"
            color="black"
            textAlign={"center"}
            fontSize={38}
          >
            {title}
          </Heading>
          {children}
        </CardBody>
      </Card>
    </Box>
  );
};
