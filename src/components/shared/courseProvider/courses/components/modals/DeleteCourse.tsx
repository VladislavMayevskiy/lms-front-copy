import { Button } from "@chakra-ui/react";
import { toast } from "react-toastify";
import Modal from "components/ui/modal";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useCourseStore } from "../../hooks/useCourse";
import { useDeleteCourse } from "api/courseProvider/courses/hooks";

export const DeleteCourse = () => {
  const { modals, closeModal } = useModal();
  const { course, setCourse } = useCourseStore();
  const { mutate, isPending } = useDeleteCourse();

  const handleClose = () => {
    setCourse(null);
    closeModal(CourseProviderModalConsts.Delete);
  };
  const handleDelete = () => {
    if (!course?.id) return;
      mutate(course.id, {
        onSuccess: () => {
          toast.success("The course was successfully deleted");
          handleClose();
        },
      });
  };

  return (
    <Modal
      isOpen={modals[CourseProviderModalConsts.Delete].isOpen}
      onClose={handleClose}
      title="Delete course"
      subTitle="Are you sure you want to delete this course?"
    >
      <div className="w-full flex justify-center items-center gap-5 pb-5">
        <Button onClick={handleClose} disabled={isPending}>Cancel</Button>
        <Button colorScheme="red" onClick={handleDelete} disabled={isPending}>Delete</Button>
      </div>
    </Modal>
  );
};