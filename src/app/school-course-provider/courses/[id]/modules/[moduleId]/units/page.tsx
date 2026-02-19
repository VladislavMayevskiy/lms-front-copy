import { useParams } from "react-router-dom";
import SchoolCourseProviderUnits from "modules/school-course-provider/courses/id/modules/moduleId/units";

function SchoolCourseProviderUnitsPage() {
  const { id, moduleId } = useParams();

  return (
    <SchoolCourseProviderUnits
      courseId={Number(id)}
      moduleId={Number(moduleId)}
    />
  );
};

export default SchoolCourseProviderUnitsPage;
