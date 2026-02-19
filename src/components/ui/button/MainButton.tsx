import classNames from "classnames";
import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

export const MainButton = ({ disabled, className, colorScheme = "blue", ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      disabled={disabled || props.isLoading}
      colorScheme={colorScheme}
      className={
        classNames(
          "px-8! py-3! rounded-[10px]!",
          className,
          {
            "opacity-50 cursor-not-allowed!": disabled,
          }
        )
      }
    />
  );
}
