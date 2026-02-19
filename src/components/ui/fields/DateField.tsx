import { Input } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";
import classNames from "classnames";

import "react-datepicker/dist/react-datepicker.css";

type Props = {
  label?: string;
  error?: string;
} & InputProps;

export const DateField = ({ label, error, className, id, ...rest }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label htmlFor={id} className="text-sm font-bold text-dark-grey font-[Lato]">{label}</label>}
      <div className="w-full flex flex-col gap-2 border! border-middle-blue! rounded-[10px] h-[46px] bg-grey overflow-hidden">
        <Input
          className={
            classNames(
              "text-primary! placeholder:text-primary! text-sm! font-normal! w-full h-full! border-none!",
              className,
            )
          }
          type="date"
          {...rest}
        />
      </div>
      {error && <p className="text-sm font-bold text-error font-[Lato]">{error}</p>}
    </div>
  );
};
