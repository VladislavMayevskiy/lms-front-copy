import type { ReactElement } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
} from "@chakra-ui/react";
import ArrowDownIcon from "assets/imgs/ArrowDown.svg?react";

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
  return (
    <Menu>
      <MenuButton type="button">
        <HStack>
          {trigger}
          {!hideArrowIcon && (
            <ArrowDownIcon />
          )}
        </HStack>
      </MenuButton>
      <MenuList>
        {items.map(({ label, onClick }) => (
          <MenuItem key={`action-menu-item-${label}`} onClick={onClick}>{label}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};