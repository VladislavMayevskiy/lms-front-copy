import type { InputHTMLAttributes } from "react";
import classNames from "classnames";

type Props = {
  label?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField = ({ label, error, className, id, ...rest }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label htmlFor={id} className="text-sm font-bold text-dark-grey font-[Lato]">{label}</label>}
      <div className="w-full flex flex-col gap-2 border! border-middle-blue! rounded-[10px] p-3 bg-grey">
        <input
          id={id}
          className={
            classNames(
              "text-primary! placeholder:text-primary! text-sm! font-normal! w-full h-full",
              className,
            )
          }
          {...rest}
        />
      </div>
      {error && <p className="text-sm font-bold text-error font-[Lato]">{error}</p>}
    </div>
  );
};
