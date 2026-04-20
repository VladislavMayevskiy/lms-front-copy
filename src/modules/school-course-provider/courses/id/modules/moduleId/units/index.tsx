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
import { UnitsList } from "components/shared/courseProvider/units/components/UnitsList";
import { CreateUnitModal, DeleteUnit } from "components/shared/courseProvider/units/components/modals";
import { TranslationsModal } from "components/shared/courseProvider/translations/TranslationsModal";
import PlusIcon from "assets/imgs/plus.svg?react";
import { SchoolCourseProviderRoutes } from "constants/routes";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useCourseQuery } from "api/courseProvider/courses/hooks";
import { useModuleQuery } from "api/courseProvider/modules/hooks";

function CourseProviderUnits({ courseId, moduleId }: { courseId: number; moduleId: number; }) {
  const openModal = useModal((state) => state.openModal);
  const { data: course } = useCourseQuery(courseId);
  const { data: module } = useModuleQuery(moduleId);

  return (
    <CourseProviderLayout>
      <PageHeader
        title={course.name}
        breadcrumb={
          <Breadcrumb separator={<div className="w-2.5 h-2.5 rounded-full bg-dark" />}>
            <BreadcrumbItem>
              <BreadcrumbLink href={SchoolCourseProviderRoutes.courses}>
                <Text fontSize={"32px"} maxW={'460px'} isTruncated>
                  {course.name}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href={SchoolCourseProviderRoutes.modules.replace(":id", courseId.toString())}>
                <Text fontSize={"24px"} maxW={'460px'} isTruncated>
                  {module.name}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink isCurrentPage>
                <Text fontSize={"24px"}>
                  Units
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>

          </Breadcrumb>
        }
        showBack
      >
        <Button
          borderRadius={"10px"}
          bgColor={"var(--brand-primary, #0070C1)"}
          _hover={{ bgColor: "var(--brand-primary, #0070C1)" }}
          textColor={"white"}
          height={"44px"}
          onClick={() => openModal(CourseProviderModalConsts.CreateUnit)}
          leftIcon={<PlusIcon />}
        >
          Create Unit
        </Button>
      </PageHeader>
      <ContentLayout>
        <UnitsList
          courseId={courseId}
          moduleId={moduleId}
        />
      </ContentLayout>
      <CreateUnitModal
        moduleId={moduleId}
        baseRoute={SchoolCourseProviderRoutes.sections.replace(":id", courseId.toString()).replace(":moduleId", moduleId.toString())}
      />
      <DeleteUnit />
      <TranslationsModal />
    </CourseProviderLayout>
  );
};

export default CourseProviderUnits;