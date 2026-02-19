import { useParams } from "react-router-dom";
import CourseProviderUnits from "modules/course-provider/courses/id/modules/moduleId/units";

function CourseProviderUnitsPage() {
  const { id, moduleId } = useParams();

  return (
    <CourseProviderUnits
      courseId={Number(id)}
      moduleId={Number(moduleId)}
    />
  );
};

export default CourseProviderUnitsPage;
