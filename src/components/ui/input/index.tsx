import { Input, type InputProps } from "@chakra-ui/react";
import { forwardRef } from "react";

type Props = InputProps & {
  placeholder?: string;
};

const InputLMS = forwardRef<HTMLInputElement, Props>(
  ({ placeholder, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        placeholder={placeholder}
        bgColor="#F5F7F9"
        borderWidth="1px"
        borderRadius="10px"
        borderColor="#B4D6DF"
        p="12px"
        width="336px"
        h="44px"
        {...props}
      />
    );
  }
);

InputLMS.displayName = "InputLMS";

export default InputLMS;
