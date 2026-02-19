import type { PropsWithChildren } from "react";
import { Card, CardBody } from "@chakra-ui/react";

type Props = {
  hideShadow?: boolean;
  hideBorder?: boolean;
};

export const ContentLayout = ({ hideShadow, hideBorder, children }: PropsWithChildren<Props>) => {
  return (
    <Card
      borderRadius="20px"
      bg="white"
      borderColor={'#B4D6DF'}
      borderWidth={hideBorder ? 0 : '1px'}
      shadow={hideShadow ? "none" : "base"}
    >
      <CardBody p="24px">
        {children}
      </CardBody>
    </Card>
  );
};
