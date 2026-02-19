import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { MainButton } from "components/ui/button";
import { QuestionsForm } from "./QuestionsForm";
import { quizSchemaResolver } from "./validation/quiz.schema";
import type { QuizSchema } from "./validation/quiz.schema";
import { useQuizModal } from "../../../hooks/useQuizModal";
import { useQuizDeleteModal } from "../../../hooks/useQuizDeleteModal";
import { useUpdateUnitQuiz } from "api/courseProvider/units/hooks";
import type { ApiQuizType } from "api/courseProvider/units/types";

type Props = {
  unitId: number;
  questions: ApiQuizType[];
};

export const QuizForm = ({ unitId, questions }: Props) => {
  const closeModal = useQuizModal((store) => store.closeModal);
  const openConfirmQuizDeleteModal = useQuizDeleteModal((store) => store.openModal);
  const { mutate: updateQuiz, isPending } = useUpdateUnitQuiz();

  const methods = useForm<QuizSchema>({
    values: {
      questions,
    },
    resolver: quizSchemaResolver,
  });

  const onSubmit = (data: QuizSchema) => {
    updateQuiz({ unitId, data }, {
      onSuccess: ({ data }) => {
        methods.reset({
          questions: data,
        });
        closeModal();
      },
      onError: (error) => {
        if (error.status === 422) {
          const errors = error.response?.data.errors;

          errors?.questions.forEach((errorMessage) => (
            toast.error(errorMessage)
          ));
        } else {
          toast.error(error.response?.data.message || error.message);
        }
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4 max-h-screen overflow-y-auto">
        <QuestionsForm />
        <div className="flex items-center justify-center gap-2">
          <MainButton type="submit" disabled={isPending}>Save</MainButton>
          <MainButton
            onClick={closeModal}
            disabled={isPending}
            className="border! border-primary! bg-white!"
          >
            <span className="text-primary! font-[Lato]">Cancel</span>
          </MainButton>
          {questions.length > 0 && (
            <MainButton
              onClick={openConfirmQuizDeleteModal}
              disabled={isPending}
              className="border! border-error! bg-white!"
            >
              <span className="text-error! font-[Lato]">Delete</span>
            </MainButton>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
