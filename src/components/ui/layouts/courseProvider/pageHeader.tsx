import type { PropsWithChildren, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { HStack, VStack, Text, Button } from "@chakra-ui/react";
import ArrowLeftIcon from "assets/imgs/ArrowLeft.svg?react";

type Props = {
  title: string;
  showBack?: boolean;
  breadcrumb?: ReactNode;
};

export const PageHeader = ({ title, children, showBack, breadcrumb }: PropsWithChildren<Props>) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <VStack gap={4} align={"flex-start"}>
      {showBack && (
        <Button onClick={handleBackClick} leftIcon={<ArrowLeftIcon />} variant="link">
          Back
        </Button>
      )}
      <HStack justify={"space-between"} w={"full"}>
        {breadcrumb || <Text fontSize={"32px"}>{title}</Text>}
        {children}
      </HStack>
    </VStack>
  );
};
