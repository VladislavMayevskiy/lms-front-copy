import type { DetailedHTMLProps, HTMLAttributes } from "react";
import classNames from "classnames";

export const LabledIcon = ({ className, children, ...rest }: DetailedHTMLProps<HTMLAttributes<HTMLLabelElement>, HTMLLabelElement>) => {
  return (
    <label
      className={
        classNames(
          "font-[Lato] font-bold text-[18px] text-dark-text",
          "flex items-center gap-3",
          className,
        )
      }
      { ...rest }
    >
      {children}
    </label>
  );
};