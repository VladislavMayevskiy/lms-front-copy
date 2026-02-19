import type { PropsWithChildren } from "react";
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Button,
  HStack
} from "@chakra-ui/react";
import Close from "assets/imgs/admin/modal/x.svg?react"

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function DeleteModalMobile({ isOpen, title, onClose, children,onConfirm,isLoading, }: PropsWithChildren<Props>) {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="30px"
        w={'90%'}
        maxH={'65%'}
        px="40px"
        py="15px"
        className="lms-overlay"
      >
        <ModalHeader
          textAlign="center"
          fontFamily="Lato"
          fontSize="24px"
          fontWeight="600"
          color="#100B20"
          
        >
          {title}
        </ModalHeader>

        <ModalCloseButton sx={{ top: "20px", right: "20px" }}>
          <Close />
        </ModalCloseButton>

        {children}

        <HStack justify={"center"} mt={"40px"} spacing={"20px"}>
        <Button _hover={{bgColor:"white"}}  bgColor={"white"} borderWidth={"1px"} borderColor={"#434645"} fontFamily="Lato" borderRadius="10px"  w="150px" h="48px" onClick={onClose}>Cancel</Button>
        <Button 
         bgColor={"#FE4040"}
                textColor="white"
                w="150px"
                h="48px"
                borderRadius="10px"
                           fontFamily="Lato"
         _hover={{bgColor:"#FE4040"}} onClick={onConfirm} isLoading={isLoading}>Delete</Button>
        </HStack>
      </ModalContent>
    </ChakraModal>
  );
};