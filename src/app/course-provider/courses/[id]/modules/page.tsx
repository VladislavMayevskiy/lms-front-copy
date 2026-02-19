import { useParams } from "react-router-dom";
import CourseProviderModules from "modules/course-provider/courses/id/modules";

function CourseProviderModulesPage() {
  const { id } = useParams();

  return (
    <CourseProviderModules
      courseId={Number(id)}
    />
  );
};

export default CourseProviderModulesPage;