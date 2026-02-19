import type { InputHTMLAttributes } from "react";
import classNames from "classnames";

type Props = {
  label?: string;
  error?: string;
  fieldContainerClassName?: string;
} & InputHTMLAttributes<HTMLTextAreaElement>;

export const TextAreatField = ({ label, error, className, id, fieldContainerClassName, ...rest }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label htmlFor={id} className="text-sm font-bold text-dark-grey font-[Lato]">{label}</label>}
      <div
        className={
          classNames(
            "w-full flex flex-col gap-2 border! border-middle-blue! rounded-[10px] p-3 bg-grey",
            fieldContainerClassName,
          )
        }
      >
        <textarea
          id={id}
          className={
            classNames(
              "text-primary! placeholder:text-primary! text-sm! font-normal! w-full h-full field-sizing-content resize-none!",
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
