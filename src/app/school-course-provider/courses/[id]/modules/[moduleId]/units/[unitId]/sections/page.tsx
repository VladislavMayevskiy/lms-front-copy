import { useParams } from "react-router-dom";
import SchoolCourseProviderSections from "modules/school-course-provider/courses/id/modules/moduleId/units/unitId/sections";

function SchoolCourseProviderSectionsPage() {
  const { id, moduleId, unitId } = useParams();

  return (
    <SchoolCourseProviderSections
      courseId={Number(id)}
      moduleId={Number(moduleId)}
      unitId={Number(unitId)}
    />
  );
};

export default SchoolCourseProviderSectionsPage;