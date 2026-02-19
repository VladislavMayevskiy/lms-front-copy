import { Card } from "../ui/Card";
import { ListHeader } from "./ListHeader";
import { CoursesTable } from "./CoursesTable";
import { useCoursesQuery } from "api/courseProvider/courses/hooks";
import { useCoursesParams } from "./hooks/useCoursesParams";

export const CoursesList = () => {
  const { params, setParams } = useCoursesParams();
  const { data, isLoading } = useCoursesQuery(params?.search ? params : {});

  return (
    <Card className="border-middle-blue! flex flex-col">
      <ListHeader
        title="Courses"
        seach={params?.search || ''}
        handleSearchChange={(search) => setParams({ ...params, search })}
      />
      <CoursesTable
        courses={data.data}
        isLoading={isLoading}
      />
    </Card>
  );
};
