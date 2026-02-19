import { Button } from "@chakra-ui/react";
import { toast } from "react-toastify";
import Modal from "components/ui/modal";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useUnitStore } from "../../hooks/useUnit";
import { useDeleteUnit } from "api/courseProvider/units/hooks";

export const DeleteUnit = () => {
  const { modals, closeModal } = useModal();
  const { unit, setUnit } = useUnitStore();
  const { mutate, isPending } = useDeleteUnit();

  const handleClose = () => {
    setUnit(null);
    closeModal(CourseProviderModalConsts.Delete);
  };
  const handleDelete = () => {
    if (!unit?.id) return;
      mutate(unit.id, {
        onSuccess: () => {
          toast.success("The unit was successfully deleted");
          handleClose();
        },
      });
  };

  return (
    <Modal
      isOpen={modals[CourseProviderModalConsts.Delete].isOpen}
      onClose={() => closeModal(CourseProviderModalConsts.Delete)}
      title="Delete unit"
      subTitle="Are you sure you want to delete this unit?"
    >
      <div className="w-full flex justify-center items-center gap-5 pb-5">
        <Button onClick={handleClose} disabled={isPending}>Cancel</Button>
        <Button colorScheme="red" onClick={handleDelete} disabled={isPending}>Delete</Button>
      </div>
    </Modal>
  );
};