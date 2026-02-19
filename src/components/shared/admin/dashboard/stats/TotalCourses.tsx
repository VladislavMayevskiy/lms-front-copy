import { Spinner } from "components/ui/spinner";
import { Card, LabledIcon } from "../ui";
import CoursesIcon from "assets/imgs/admin/dashboard/courses.svg?react";
import { useTotalCourses } from "api/admin/dashboard/hooks";

export const TotalCourses = () => {
  const { data, isLoading } = useTotalCourses();

  if (isLoading) {
    return (
      <Spinner
        isLoading
      />
    );
  }

  return (
    <Card className="pt-18">
      <div className="flex items-center justify-between">
        <LabledIcon>
          <CoursesIcon />
          Total courses
        </LabledIcon>
        <span className="font-[Lato] font-bold text-[24px] text-dark-text">{data?.data}</span>
      </div>
    </Card>
  );
};