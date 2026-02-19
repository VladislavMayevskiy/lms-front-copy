import { ListHeader } from "./ListHeader";
import { CoursesTable } from "./CoursesTable";
import { useCoursesQuery } from "api/courseProvider/courses/hooks";
import { useCoursesParams } from "../hooks/useCoursesParams";

export const CoursesList = () => {
  const { params, setParams } = useCoursesParams();
  const { data, isLoading } = useCoursesQuery(params?.search ? params : {});

  return (
    <div className="flex flex-col gap-4">
      <ListHeader
        title={`${data.meta?.total || 0} ${(data.meta?.total || 0) === 1 ? 'Course' : 'Courses'}`}
        seach={params?.search || ''}
        handleSearchChange={(search) => setParams({ ...params, search })}
      />
      <CoursesTable
        courses={data.data}
        isLoading={isLoading}
      />
    </div>
  );
};
