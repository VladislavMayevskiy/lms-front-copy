import classNames from "classnames";
import type { CourseStatusType } from "types/models/Course";
import { styles } from "./constants";

type Props = {
  status: CourseStatusType
};

export const CourseStatus = ({ status }: Props) => {
  return (
    <div
      className={
        classNames(
          "px-3.5 py-1.5 bg-white text-sm font-medium border! rounded-full text-center w-fit min-w-[89px]",
          styles[status],
        )
      }
    >
      {status}
    </div>
  );
};