import { useState } from "react";
import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { MainButton } from "components/ui/button";
import { TextField } from "components/ui/fields/TextField";
import { QuestionsForm } from "./QuestionsForm";
import { quizSchemaResolver } from "./validation/quiz.schema";
import type { QuizSchema } from "./validation/quiz.schema";
import { useQuizModal } from "../../../hooks/useQuizModal";
import { useQuizDeleteModal } from "../../../hooks/useQuizDeleteModal";
import { useUpdateUnitQuiz, useGenerateUnitQuiz } from "api/courseProvider/units/hooks";
import { useSections } from "../../../hooks/useSections";
import type { ApiQuizType } from "api/courseProvider/units/types";

/** Section type names that the backend can generate quiz questions from. */
const TEXT_SECTION_TYPES = new Set(["TITLE_AND_TEXT", "NOTE_FOR_TEACHER", "EMBED"]);

type Props = {
  unitId: number;
  questions: ApiQuizType[];
};

export const QuizForm = ({ unitId, questions }: Props) => {
  const closeModal = useQuizModal((store) => store.closeModal);
  const openConfirmQuizDeleteModal = useQuizDeleteModal((store) => store.openModal);
  const { mutate: updateQuiz, isPending } = useUpdateUnitQuiz();
  const { mutate: generateQuiz, isPending: isGenerating } = useGenerateUnitQuiz();

  // Determine whether the unit has any text-based sections that the backend
  // can generate quiz questions from.  This lets us show a clear pre-flight
  // warning instead of letting the API call fail with a cryptic 422.
  // SectionType.type is already the string name (e.g. "TITLE_AND_TEXT") as
  // mapped by mapFromSection, so a direct Set lookup is sufficient.
  const sections = useSections((store) => store.sections);
  const hasTextSections = sections.some((s) => TEXT_SECTION_TYPES.has(s.type));

  const [questionsCount, setQuestionsCount] = useState("5");

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

  const NO_TEXT_CONTENT_MESSAGE =
    "Quiz cannot be generated because this unit has no text content to generate from. " +
    "Add at least one Text, Teacher Notes, or Embed section first.";

  const handleGenerateQuiz = () => {
    const count = Number(questionsCount);
    if (isNaN(count) || count < 1 || count > 20) {
      toast.error("Number of questions must be between 1 and 20.");
      return;
    }

    // Pre-flight guard: avoid sending the request if we already know the
    // backend will reject it with 422 "no text content".
    if (!hasTextSections) {
      toast.error(NO_TEXT_CONTENT_MESSAGE);
      return;
    }

    generateQuiz({ unitId, params: { questions_count: count } }, {
      onSuccess: ({ data }) => {
        methods.reset({ questions: data });
        toast.success("Quiz generated successfully!");
      },
      onError: (error) => {
        // 422 from the backend means "no text content to generate from".
        // Surface a clear explanation instead of the raw API message.
        if (error.status === 422) {
          toast.error(NO_TEXT_CONTENT_MESSAGE);
        } else {
          toast.error(error.response?.data.message || "Failed to generate quiz.");
        }
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4 max-h-screen overflow-y-auto">
        <div className="flex items-end gap-4">
          <TextField
            id="questions-count"
            label="Number of questions (1–20)"
            type="number"
            value={questionsCount}
            onChange={(e) => setQuestionsCount(e.target.value)}
            min="1"
            max="20"
          />
          <MainButton
            type="button"
            onClick={handleGenerateQuiz}
            disabled={isGenerating || isPending || !hasTextSections}
            isLoading={isGenerating}
            title={
              !hasTextSections
                ? "Add at least one Text, Teacher Notes, or Embed section to enable quiz generation."
                : undefined
            }
          >
            Generate Quiz
          </MainButton>
        </div>
        <QuestionsForm />
        <div className="flex items-center justify-center gap-2">
          <MainButton type="submit" disabled={isPending || isGenerating}>Save</MainButton>
          <MainButton
            type="button"
            onClick={closeModal}
            disabled={isPending || isGenerating}
            className="border! border-primary! bg-white!"
          >
            <span className="text-primary! font-[Lato]">Cancel</span>
          </MainButton>
          {questions.length > 0 && (
            <MainButton
              type="button"
              onClick={openConfirmQuizDeleteModal}
              disabled={isPending || isGenerating}
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
