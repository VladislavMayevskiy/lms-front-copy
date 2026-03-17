import { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import X from "assets/imgs/admin/modal/Close.svg?react";
import Chevron from "assets/imgs/admin/modal/chevron.svg?react";
import Check from "assets/imgs/admin/modal/check.svg?react";

// Chakra's Checkbox clones the icon element and injects `isChecked` / `isIndeterminate`
// as React props. SVG components from Vite's SVGR spread all props onto the <svg> DOM
// element, causing "React does not recognize the `isChecked` prop on a DOM element".
// Strip those props here before they reach the raw DOM node.
const CheckboxIcon = ({
  isChecked: _isChecked,
  isIndeterminate: _isIndeterminate,
  ...rest
}: {
  isChecked?: boolean;
  isIndeterminate?: boolean;
  [key: string]: unknown;
}) => <Check {...(rest as React.SVGProps<SVGSVGElement>)} />;

// Props are generic over the id type (number for schools, string for language codes, etc.)
type Props<T extends { id: number | string; name: string }> = {
  label: string;
  placeholder: string;
  error?: string;
  value?: Array<T['id']>;
  onChange: (value: Array<T['id']>) => void;
  data: T[];
};

export const SelectMultipleField = <T extends { id: number | string; name: string }>({
  label,
  placeholder,
  error,
  value,
  onChange,
  data,
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selected = (value ?? []) as Array<T['id']>;

  const toggleItem = (id: T['id']) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <VStack align="stretch" spacing="4px" position="relative">
      <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
        {label}
      </Text>

      <Box
        borderWidth="1px"
        borderRadius="10px"
        borderColor={error ? "#d32f2f" : "#b4d6df"}
        bg="#F5F7F9"
        minH="44px"
        px="12px"
        py="6px"
        position="relative"
      >
        <Box
          display="flex"
          flexWrap="wrap"
          gap="8px"
          maxH="44px"
          overflowY="auto"
          pr="40px"
          cursor="pointer"
          onClick={e => {
            e.stopPropagation();
            setIsOpen(prev => !prev);
          }}
        >
          {selected.length === 0 ? (
            <Text
              fontFamily="Lato"
              fontSize="14px"
              color={error ? "#F23B3B" : "#0070C1"}
              py="4px"
            >
              {placeholder}
            </Text>
          ) : (
            selected.map(id => {
              const item = data.find(s => s.id === id);
              if (!item) return null;

              return (
                <HStack
                  key={`selected-${id}`}
                  px="10px"
                  py="4px"
                  borderRadius="10px"
                  borderWidth="1px"
                  borderColor="#B4D6DF"
                  bg="white"
                  spacing="6px"
                  width="fit-content"
                  maxW="max-content"
                >
                  <Text
                    fontFamily="Lato"
                    fontSize="14px"
                    color="#434645"
                    whiteSpace="nowrap"
                  >
                    {item.name}
                  </Text>

                  <Box
                    cursor="pointer"
                    onClick={e => {
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                  >
                    <X />
                  </Box>
                </HStack>
              );
            })
          )}
        </Box>

        <Box
          position="absolute"
          right="12px"
          top="50%"
          transform={
            isOpen
              ? "translateY(-50%) rotate(180deg)"
              : "translateY(-50%) rotate(0deg)"
          }
          transition="0.2s ease"
        >
          <Chevron />
        </Box>
      </Box>

      {error && (
        <Text fontSize="12px" color="#F23B3B">
          {error}
        </Text>
      )}

      {isOpen && (
        <Box
          position="absolute"
          top="78px"
          left="0"
          right="0"
          zIndex={100}
          borderRadius="20px"
          borderWidth="1px"
          borderColor="#B4D6DF"
          bg="white"
          boxShadow="0 8px 25px rgba(0,0,0,0.15)"
          py="10px"
          px="22px"
          minH="150px"
        >
          <VStack align="stretch" spacing="4px">
            {data.map(item => (
              <HStack key={`option-${item.id}`} spacing="8px">
                <Checkbox
                  isChecked={selected.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  icon={<CheckboxIcon />}
                  sx={{
                    ".chakra-checkbox__control": {
                      borderRadius: "5px",
                      borderColor: "#B4D6DF",
                      width: "20px",
                      height: "20px",
                      borderWidth: "1px",
                    },
                  }}
                />
                <Text
                  fontFamily="Lato"
                  fontSize="16px"
                  color="#434645"
                >
                  {item.name}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
};