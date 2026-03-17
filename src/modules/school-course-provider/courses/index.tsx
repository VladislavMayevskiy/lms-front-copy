import { Button } from "@chakra-ui/react";
import {
  CourseProviderLayout,
  PageHeader,
  ContentLayout,
} from "components/ui/layouts/courseProvider";
import { CoursesList } from "components/shared/schoolCourseProvider/courses/components/CoursesList";
import { CreateCourseModal, DeleteCourse } from "components/shared/schoolCourseProvider/courses/components/modals";
import { TranslationsModal } from "components/shared/courseProvider/translations/TranslationsModal";
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
      <TranslationsModal />
    </CourseProviderLayout>
  );
};

export default CourseProviderCourses;