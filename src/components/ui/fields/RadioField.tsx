import type { PropsWithChildren } from "react";
import classNames from "classnames";
import { Stack, useRadioGroup, useRadio } from "@chakra-ui/react";
import type { RadioGroupProps, UseRadioProps } from "@chakra-ui/react";

type Option = {
  label: string;
  value: string;
};

type RadioFieldProps = {
  options: Option[];
  label?: string;
  error?: string;
} & Omit<RadioGroupProps, "children">;

export const RadioField = ({ options, label, error, ...rest }: RadioFieldProps) => {
  const { getRadioProps } = useRadioGroup(rest);

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label htmlFor={rest.id} className="text-sm font-bold text-dark-grey font-[Lato]">{label}</label>}
      <Stack direction="row" className="gap-6!">
        {options.map(({ value, label }) => {
          const radio = getRadioProps({ value });

          return (
            <RadioOption key={value} {...radio}>
              {label}
            </RadioOption>
          )
        })}
      </Stack>
      {error && <p className="text-sm font-bold text-error font-[Lato]">{error}</p>}
    </div>
  );
};

const RadioOption = ({ children, ...rest }: PropsWithChildren<UseRadioProps>) => {
  const { getInputProps, getRadioProps } = useRadio(rest);
  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <label className="group">
      <input {...input} />
      <div {...checkbox} className="flex gap-3 items-center cursor-pointer">
        <div
          className={
            classNames(
              "w-6 h-6 rounded-full border! border-middle-blue! bg-light-blue",
              "group-has-checked:border-primary!",
              "flex items-center justify-center"
            )
          }
        >
          <div className="hidden group-has-checked:flex! w-4 h-4 rounded-full bg-primary" />
        </div>
        {children}
      </div>
    </label>
  );
};
