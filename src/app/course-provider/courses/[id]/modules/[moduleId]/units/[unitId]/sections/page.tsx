import { useParams } from "react-router-dom";
import CourseProviderSections from "modules/course-provider/courses/id/modules/moduleId/units/unitId/sections";

function CourseProviderSectionsPage() {
  const { id, moduleId, unitId } = useParams();

  return (
    <CourseProviderSections
      courseId={Number(id)}
      moduleId={Number(moduleId)}
      unitId={Number(unitId)}
    />
  );
};

export default CourseProviderSectionsPage;