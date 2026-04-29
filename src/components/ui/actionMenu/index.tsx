import type { ReactElement } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
} from "@chakra-ui/react";
import ArrowDownIcon from "assets/imgs/ArrowDown.svg?react";
import { localStore } from "stores/localStore";

type MenuItemType = {
  label: string;
  onClick: () => void;
};

type Props = {
  trigger: ReactElement;
  items: MenuItemType[];
  hideArrowIcon?: boolean;
};

export const ActionMenu = ({ trigger, items, hideArrowIcon }: Props) => {
  const direction = localStore((s) => s.direction);

  return (
    <Menu
      placement={direction === "rtl" ? "bottom-end" : "bottom-start"}
      strategy="fixed"
    >
      <MenuButton type="button">
        <HStack>
          {trigger}
          {!hideArrowIcon && (
            <ArrowDownIcon />
          )}
        </HStack>
      </MenuButton>
      <MenuList
        maxW="calc(100vw - 24px)"
        overflowX="hidden"
      >
        {items.map(({ label, onClick }) => (
          <MenuItem key={`action-menu-item-${label}`} onClick={onClick}>{label}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};