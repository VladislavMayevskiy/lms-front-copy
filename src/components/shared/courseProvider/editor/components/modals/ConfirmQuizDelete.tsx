import { toast } from "react-toastify";
import Modal from "components/ui/modal";
import { MainButton } from "components/ui/button";
import { useQuizDeleteModal } from "../../hooks/useQuizDeleteModal";
import { useQuizModal } from "../../hooks/useQuizModal";
import { useDeleteUnitQuiz } from "api/courseProvider/units/hooks";

type Props = {
  unitId: number;
};

export const ConfirmQuizDeleteModal = ({ unitId }: Props) => {
  const { isOpen, closeModal } = useQuizDeleteModal();
  const handleCloseQuizModal = useQuizModal((store) => store.closeModal);
  const { mutate: deleteQuiz, isPending } = useDeleteUnitQuiz();

  const handleDeleteQuiz = () => {
    deleteQuiz(unitId, {
      onSuccess: () => {
        handleCloseQuizModal();
        closeModal();
        toast.success('Quiz deleted successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Delete quiz?"
      subTitle="Are you sure you want to delete quiz?"
    >
      <div className="flex items-center justify-center gap-2">
        <MainButton
          onClick={handleDeleteQuiz}
          disabled={isPending}
          className="border! border-error! bg-white!"
        >
          <span className="text-error! font-[Lato]">Delete</span>
        </MainButton>
        <MainButton
          onClick={closeModal}
          disabled={isPending}
          className="border! border-primary! bg-white!"
        >
          <span className="text-primary! font-[Lato]">Cancel</span>
        </MainButton>
      </div>
    </Modal>
  );
};