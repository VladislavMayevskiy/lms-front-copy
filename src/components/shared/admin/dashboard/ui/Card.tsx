import type { DetailedHTMLProps, HTMLAttributes } from "react";
import classNames from "classnames";

export const Card = ({ className, children, ...rest }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div
      className={
        classNames(
          "h-full rounded-lg! border! p-6 gap-3 bg-white border-border-light-grey!",
          className,
        )
      }
      { ...rest }
    >
      {children}
    </div>
  );
};