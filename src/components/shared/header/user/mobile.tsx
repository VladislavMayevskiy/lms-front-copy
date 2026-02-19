import {
  Box,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import MenuIcon from "assets/imgs/user/mobile/menu.svg?react"
import CloseIcon from "assets/imgs/user/mobile/close.svg?react"
import Logo from "components/ui/logo";

export default function UserHeaderMobile({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <Box
      h="72px"
      bg="white"
      borderBottom="1px solid #B4D6DF"
      px="16px"
      position="sticky"
      top={0}
      zIndex={3}
      className="lms-box md:hidden"
    >
      <HStack h="100%" justify="space-between">
        <Logo />

        <IconButton
          aria-label="Menu"
          icon={isOpen ? <CloseIcon /> : <MenuIcon />}
          variant="ghost"
          onClick={onToggle}
        />
      </HStack>
    </Box>
  );
}