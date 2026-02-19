import { Divider } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { TextAreatField } from "components/ui/fields/TextAreaField";
import { OptionsForm } from "./OptionsForm";
import DeleteIcon from "assets/imgs/delete.svg?react";
import type { QuizSchema } from "./validation/quiz.schema";

export const QuestionsForm = () => {
  const { control } = useFormContext<QuizSchema>();
  const { fields, append, remove } = useFieldArray({ control, name: "questions" });

  const handleAddQuestion = () => {
    append({
      id: null,
      content: "",
      is_multiple: true,
      options: [],
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {fields.map((item, index) => (
          <motion.div
            className="flex flex-col gap-2 flex-1"
            key={`quiz-question-${item.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Controller
              control={control}
              name={`questions.${index}.content`}
              render={({ field, fieldState: { error } }) => (
                <div key={`quiz-question-${item.id}`} className="flex gap-4 items-end">
                  <TextAreatField
                    label={`Question #${index + 1}`}
                    placeholder="Enter Question"
                    error={error?.message}
                    {...field}
                  />
                  <DeleteIcon
                    className="mb-2.5 cursor-pointer"
                    onClick={() => remove(index)}
                  />
                </div>
              )}
            />
            <OptionsForm
              questionIndex={index}
            />
            <Divider className="bg-border-grey" />
          </motion.div>
        ))}
      </div>
      <div
        onClick={handleAddQuestion}
        className="text-primary font-[Lato] font-semibold cursor-pointer self-center"
      >
        + Add Question
      </div>
    </div>
  );
};
