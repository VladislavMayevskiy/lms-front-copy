import { Box, Text, useToast } from "@chakra-ui/react";
import InfoIcon from "assets/imgs/info.svg?react";
import CloseIcon from "assets/imgs/Close.svg?react";

export function ToastComponent() {
  const chakraToast = useToast();

  const showToast = (title: string): void => {
    chakraToast({
      position: "top-right",
      duration: 4000,
      isClosable: true,
      render: ({ onClose }) => (
        <Box
          mt="30px"
          mr="10px"
          bgColor="#F5F7F9"
          p="16px 24px"
          borderRadius="10px"
          borderWidth="1px"
          borderColor="#B4D6DF"
          display="flex"
          alignItems="center"
          gap="16px"
          width="307px"
          height="64px"
        >
          <InfoIcon width="24px" height="24px" />

          <Text
            fontWeight="medium"
            fontSize="14px"
            fontFamily="Lato"
            color="#1F2221"
            lineHeight="144%"
          >
            {title}
          </Text>

          <Box
            cursor="pointer"
            onClick={onClose}
            p="4px"
            _hover={{ opacity: 0.6 }}
          >
            <CloseIcon width="20px" height="20px" />
          </Box>
        </Box>
      ),
    });
  };

  return showToast;
}
