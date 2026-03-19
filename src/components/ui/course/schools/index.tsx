import { useMemo, useCallback } from "react";
import classNames from "classnames";
import ChevronDown from "assets/imgs/ChevronDown.svg?react";
import type { Nullable } from "types/general";
import type { CourseListType } from "types/models/Course";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useCourseStore } from "components/shared/courseProvider/courses/hooks/useCourse";

type Props = {
  schoolsCount: Nullable<number>;
  course: CourseListType;
  disabled?: boolean;
};

export const Schools = ({ schoolsCount, course, disabled }: Props) => {
  const count = useMemo(() => schoolsCount || 0, [schoolsCount]);
  const openModal = useModal((store) => store.openModal);
  const setCourse = useCourseStore((store) => store.setCourse);

  const handleModal = useCallback(() => {
    setCourse(course);
    openModal(CourseProviderModalConsts.AssignedSchools);
  }, [course]);

  return (
    <button
      className={
        classNames(
          "flex items-center justify-center",
          "border! border-border-light-grey! rounded-full",
          "py-1.5! px-3! w-full max-w-[130px] bg-grey! gap-1.5",
          {
            "cursor-default!": count === 0 || disabled,
          }
        )
      }
      onClick={handleModal}
      disabled={count === 0 || disabled}
    >
      <span
        className={
          classNames(
            "font-[Lato] text-sm font-normal text-dark-grey",
            {
              "text-primary": count > 0,
            }
          )
        }
      >
        {`${count} ${count === 1 ? 'school' : 'schools'}`}
      </span>
      {(count > 0 && !disabled) && (
        <ChevronDown />
      )}
    </button>
  );
};