import { SelectField as ChakraSelectField } from "@chakra-ui/react";
import type { SelectProps } from "@chakra-ui/react";
import classNames from "classnames";

type Props = {
  label?: string;
  error?: string;
  options: {
    label: string;
    value: number;
  }[];
} & SelectProps;

export const SelectField = ({ label, error, className, id, options, ...rest }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label htmlFor={id} className="text-sm font-bold text-dark-grey font-[Lato]">{label}</label>}
      <div className="w-full flex flex-col gap-2 border! border-middle-blue! rounded-[10px] p-3 bg-grey">
        <ChakraSelectField
          id={id}
          className={
            classNames(
              "text-primary! placeholder:text-primary! text-sm! font-normal! w-full h-full",
              className,
            )
          }
          {...rest}
        >
          {options.map(({ value, label }) => (
            <option key={`select-option-${value}`} value={value}>
              {label}
            </option>
          ))}
        </ChakraSelectField>
      </div>
      {error && <p className="text-sm font-bold text-error font-[Lato]">{error}</p>}
    </div>
  );
};
