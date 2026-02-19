import { CourseProviderLayout } from "components/ui/layouts/courseProvider";
import { Editor } from "components/shared/courseProvider/editor";

type Props = {
  courseId: number;
  moduleId: number;
  unitId: number;
};

function CourseProviderSections({ unitId }: Props) {
  return (
    <CourseProviderLayout
      containerProps={{ gap: 0 }}
      pageProps={{ mx: 0 }}
    >
      <Editor
        unitId={unitId}
      />
    </CourseProviderLayout>
  );
};

export default CourseProviderSections;