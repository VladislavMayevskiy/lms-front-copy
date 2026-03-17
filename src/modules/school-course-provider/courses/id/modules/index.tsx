import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from "@chakra-ui/react";
import {
  CourseProviderLayout,
  PageHeader,
  ContentLayout,
} from "components/ui/layouts/courseProvider";
import { ModulesList } from "components/shared/courseProvider/modules/components/ModulesList";
import { CreateModuleModal, DeleteModule } from "components/shared/courseProvider/modules/components/modals";
import { TranslationsModal } from "components/shared/courseProvider/translations/TranslationsModal";
import PlusIcon from "assets/imgs/plus.svg?react";
import { SchoolCourseProviderRoutes } from "constants/routes";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useCourseQuery } from "api/courseProvider/courses/hooks";

function CourseProviderModules({ courseId }: { courseId: number }) {
  const openModal = useModal((state) => state.openModal);
  const { data: course } = useCourseQuery(courseId);

  return (
    <CourseProviderLayout>
      <PageHeader
        title={course.name}
        breadcrumb={
          <Breadcrumb separator={<div className="w-2.5 h-2.5 rounded-full bg-dark" />}>
            <BreadcrumbItem>
              <BreadcrumbLink href={SchoolCourseProviderRoutes.courses}>
                <Text fontSize={"32px"} maxW={'460px'} isTruncated>{course.name}</Text>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink isCurrentPage>
                <Text fontSize={"24px"}>
                  Modules
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>

          </Breadcrumb>
        }
        showBack
      >
        <Button
          borderRadius={"10px"}
          bgColor={"#0070C1"}
          _hover={{ bgColor: "#0070C1" }}
          textColor={"white"}
          height={"44px"}
          onClick={() => openModal(CourseProviderModalConsts.CreateModule)}
          leftIcon={<PlusIcon />}
        >
          Create Module
        </Button>
      </PageHeader>
      <ContentLayout>
        <ModulesList
          courseId={courseId}
        />
      </ContentLayout>
      <CreateModuleModal
        courseId={courseId}
        baseRoute={SchoolCourseProviderRoutes.units.replace(":id", courseId.toString())}
      />
      <DeleteModule />
      <TranslationsModal />
    </CourseProviderLayout>
  );
};

export default CourseProviderModules;