import type { PropsWithChildren } from "react";
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  VStack,
} from "@chakra-ui/react";
import Close from "assets/imgs/admin/modal/x.svg?react"

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subTitle?: string;
};

export default function ModalMobile({ isOpen, title, subTitle, onClose, children }: PropsWithChildren<Props>) {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="30px"
        w={'90%'}
        minHeight="fit-content"
        px="15px"
        py="10px"
        h={'90%'}
        overflowY="auto" 
        className="lms-overlay"
      >
        <VStack gap={1}>
          <ModalHeader
            textAlign="center"
            fontFamily="Lato"
            fontSize="24px"
            fontWeight="600"
            color="#100B20"
            p="0"
          >
            {title}
          </ModalHeader>
          {subTitle && (
            <ModalHeader
              textAlign="center"
              fontFamily="Lato"
              fontSize="18px"
              fontWeight="400"
              color="#100B20"
            >
              {subTitle}
            </ModalHeader>
          )}
        </VStack>

        <ModalCloseButton sx={{ top: "20px", right: "20px" }}>
          <Close />
        </ModalCloseButton>

        {children}

      </ModalContent>
    </ChakraModal>
  );
};