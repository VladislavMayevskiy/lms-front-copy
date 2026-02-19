import type { PropsWithChildren, ReactElement, HTMLAttributes } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";

type Item = {
  value: string | number;
  label?: string;
  icon?: ReactElement;
};

type Props<T> = {
  onChange: (value: string | number) => void;
  selectedValue: string | number;
  items: T[];
  className?: HTMLAttributes<'ul'>['className'];
};

export const Switch = <T extends Item>({ onChange, selectedValue, items, className }: PropsWithChildren<Props<T>>) => {
  return (
    <ul className={classNames("flex bg-white rounded-lg items-center justify-center p-2! border! border-middle-blue", className)}>
      {items.map((item) => (
        <motion.li
          key={item.value}
          initial={false}
          onClick={() => onChange(item.value)}
          className={
            classNames(
              "cursor-pointer transition-all duration-500 h-auto p-1.5 rounded-lg text-[#666666] relative",
              {
                "text-primary": selectedValue === item.value,
              }
            )
          }
        >
          {selectedValue === item.value ? (
            <motion.div
              className="shadow-main bg-grey z-0 w-full h-full p-1.5 absolute top-0 left-0 right-0 rounded-lg border! border-primary!"
              layoutId="shadow"
              id="shadow"
              transition={{
                duration: 0.5,
              }}
            />
          ) : null}
          <span
            className={
              classNames(
                "relative text-sm font-normal",
                {
                  "font-semibold!": selectedValue === item.value,
                }
              )
            }
          >
            {item.icon || item.label}
          </span>
        </motion.li>
      ))}
    </ul>
  );
};