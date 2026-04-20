import classNames from "classnames";
import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

const BRAND_PRIMARY = "var(--brand-primary, #0070C1)";

export const MainButton = ({
  disabled,
  className,
  colorScheme,
  variant = "solid",
  ...props
}: ButtonProps) => {
  const shouldUseBrandedDefaults = colorScheme == null;

  const brandedVariantProps: Partial<ButtonProps> = shouldUseBrandedDefaults
    ? variant === "outline"
      ? {
          borderColor: BRAND_PRIMARY,
          color: BRAND_PRIMARY,
          _hover: { bg: "var(--brand-secondary, #DDECF7)" },
        }
      : variant === "ghost"
        ? {
            color: BRAND_PRIMARY,
            _hover: { bg: "var(--brand-secondary, #DDECF7)" },
          }
        : {
            bg: BRAND_PRIMARY,
            color: "white",
            _hover: { bg: BRAND_PRIMARY },
          }
    : {};

  return (
    <Button
      {...brandedVariantProps}
      {...props}
      variant={variant}
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
