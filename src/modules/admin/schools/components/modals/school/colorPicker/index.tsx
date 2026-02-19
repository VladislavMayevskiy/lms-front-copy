import { Box, Input, HStack, Text } from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";
import "./index.css"
  type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
};

export default function ColorPicker({ color, onChange }: ColorPickerProps) {

  
  const hexToRgb = (hex: string) => {
    const c = hex.replace("#", "");
    return {
      r: parseInt(c.slice(0, 2), 16) || 0,
      g: parseInt(c.slice(2, 4), 16) || 0,
      b: parseInt(c.slice(4, 6), 16) || 0,
    };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" +
    [r, g, b]
      .map((x) => {
        const clamped = Math.min(255, Math.max(0, Number(x) || 0));
        return clamped.toString(16).padStart(2, "0");
      })
      .join("");

  const rgb = hexToRgb(color);

  return (
    <Box
      bg="white"
      borderRadius="14px"
      p="16px"
      width="392px"
      boxShadow="0 8px 25px rgba(0,0,0,0.18)"
      position="absolute"
      zIndex={2000}
    >

      <Box
        position="absolute"
        top="-12px"
        left="50%"
        transform="translateX(-50%)"
        width="0"
        height="0"
        borderLeft="12px solid transparent"
        borderRight="12px solid transparent"
        borderBottom="12px solid white"
      />

      <Box mb="24px">
        <HexColorPicker
          color={color}
          onChange={onChange}
          className="lms-color-picker"
        />
      </Box>

      <HStack spacing="12px" align="flex-start">
        <Box flex="1">
          <Text fontFamily="Lato" fontWeight="600" fontSize="16px" mb="6px">
            Hex
          </Text>
          <Input
            value={color}
            onChange={(e) => onChange(e.target.value)}
            height="40px"
            borderRadius="4px"
            borderWidth="1px"
            borderColor="#B4B4B4"
            fontSize="16px"
            fontFamily="Lato"
            bg="#F5F7F9"
            textColor="#434645"
          />
        </Box>

{(["r", "g", "b"] as Array<keyof typeof rgb>).map((key) => (
  <Box key={key} width="72px">
    <Text
      fontFamily="Lato"
      fontWeight="600"
      fontSize="16px"
      mb="6px"
    >
      {key.toUpperCase()}
    </Text>

    <Input
      type="number"
      value={rgb[key]}
      onChange={(e) => {
        const updated = {
          ...rgb,
          [key]: Number(e.target.value),
        };

        onChange(rgbToHex(updated.r, updated.g, updated.b));
      }}
      height="40px"
      borderRadius="4px"
      borderColor="#B4B4B4"
      borderWidth="1px"
      fontSize="16px"
      fontFamily="Lato"
      bg="#F5F7F9"
    />
  </Box>
))}

      </HStack>
    </Box>
  );
}
