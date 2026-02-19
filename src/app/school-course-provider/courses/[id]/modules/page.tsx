import { useParams } from "react-router-dom";
import SchoolCourseProviderModules from "modules/school-course-provider/courses/id/modules";

function SchoolCourseProviderModulesPage() {
  const { id } = useParams();

  return (
    <SchoolCourseProviderModules
      courseId={Number(id)}
    />
  );
};

export default SchoolCourseProviderModulesPage;