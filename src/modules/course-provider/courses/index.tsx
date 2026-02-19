import { Button } from "@chakra-ui/react";
import {
  CourseProviderLayout,
  PageHeader,
  ContentLayout,
} from "components/ui/layouts/courseProvider";
import { CoursesList } from "components/shared/courseProvider/courses/components/CoursesList";
import {
  CreateCourseModal,
  DeleteCourse,
  AssignedSchoolsModal,
} from "components/shared/courseProvider/courses/components/modals";
import PlusIcon from "assets/imgs/plus.svg?react";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";

function CourseProviderCourses() {
  const openModal = useModal((state) => state.openModal);

  return (
    <CourseProviderLayout>
      <PageHeader title="Courses">
        <Button
          borderRadius={"10px"}
          bgColor={"#0070C1"}
          _hover={{ bgColor: "#0070C1" }}
          textColor={"white"}
          height={"44px"}
          onClick={() => openModal(CourseProviderModalConsts.CreateCourse)}
          leftIcon={<PlusIcon />}
        >
          Create Course
        </Button>
      </PageHeader>
      <ContentLayout>
        <CoursesList />
      </ContentLayout>
      <CreateCourseModal />
      <DeleteCourse />
      <AssignedSchoolsModal />
    </CourseProviderLayout>
  );
};

export default CourseProviderCourses;