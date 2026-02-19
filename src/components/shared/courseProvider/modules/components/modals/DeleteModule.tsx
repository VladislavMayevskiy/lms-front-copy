import { Button } from "@chakra-ui/react";
import { toast } from "react-toastify";
import Modal from "components/ui/modal";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useModuleStore } from "../../hooks/useModule";
import { useDeleteModule } from "api/courseProvider/modules/hooks";

export const DeleteModule = () => {
  const { modals, closeModal } = useModal();
  const { module, setModule } = useModuleStore();
  const { mutate, isPending } = useDeleteModule();

  const handleClose = () => {
    setModule(null);
    closeModal(CourseProviderModalConsts.Delete);
  };
  const handleDelete = () => {
    if (!module?.id) return;
      mutate(module.id, {
        onSuccess: () => {
          toast.success("The module was successfully deleted");
          handleClose();
        },
      });
  };

  return (
    <Modal
      isOpen={modals[CourseProviderModalConsts.Delete].isOpen}
      onClose={() => closeModal(CourseProviderModalConsts.Delete)}
      title="Delete module"
      subTitle="Are you sure you want to delete this module?"
    >
      <div className="w-full flex justify-center items-center gap-5 pb-5">
        <Button onClick={handleClose} disabled={isPending}>Cancel</Button>
        <Button colorScheme="red" onClick={handleDelete} disabled={isPending}>Delete</Button>
      </div>
    </Modal>
  );
};