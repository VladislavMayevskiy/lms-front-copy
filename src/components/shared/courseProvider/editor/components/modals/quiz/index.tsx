import Modal from "components/ui/modal";
import { QuizForm } from "./QuizForm";
import { useQuizModal } from "../../../hooks/useQuizModal";
import { useUnitQuiz } from "api/courseProvider/units/hooks";

type Props = {
  unitId: number;
};

export const QuizModal = ({ unitId }: Props) => {
  const { isOpen, closeModal } = useQuizModal();
  const { data } = useUnitQuiz(unitId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Quiz"
    >
      {data?.data && (
        <QuizForm
          unitId={unitId}
          questions={data?.data}
        />
      )}
    </Modal>
  );
};
