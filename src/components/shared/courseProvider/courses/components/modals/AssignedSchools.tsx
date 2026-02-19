import { MainButton } from "components/ui/button";
import Modal from "components/ui/modal";
import { Spinner } from "components/ui/spinner";
import { SchoolAvatar } from "components/ui/avatar";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useCourseStore } from "../../hooks/useCourse";
import { useCourseQuery } from "api/courseProvider/courses/hooks";

export const AssignedSchoolsModal = () => {
  const { modals, closeModal } = useModal();
  const { course, setCourse } = useCourseStore();
  const { data: courseData, isLoading } = useCourseQuery(course?.id || 0);

  const handleClose = () => {
    setCourse(null);
    closeModal(CourseProviderModalConsts.AssignedSchools);
  };

  return (
    <Modal
      isOpen={modals[CourseProviderModalConsts.AssignedSchools].isOpen}
      onClose={handleClose}
      title="Assigned schools"
    >
      <div className="flex flex-col gap-5">
        {isLoading ? (
          <div className="flex p-8 items-center justify-center">
            <Spinner isLoading={isLoading} />
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto">
            {(courseData.schools || []).map((school) => (
              <div
                key={`assigned-school-${school.id}`}
                className="flex items-center gap-2"
              >
                <SchoolAvatar
                  avatar={school.logo}
                  name={school.name}
                />
                <div className="flex flex-col">
                  <span>{school.name}</span>
                  <span className="text-xs opacity-50">{school.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="w-full flex justify-center items-center gap-5 pb-5">
          <MainButton onClick={handleClose}>Close</MainButton>
        </div>
      </div>
    </Modal>
  );
};