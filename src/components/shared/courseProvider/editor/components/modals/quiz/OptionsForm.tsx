import { motion } from "framer-motion";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { TextField } from "components/ui/fields/TextField";
import { RadioField } from "components/ui/fields/RadioField";
import DeleteIcon from "assets/imgs/delete.svg?react";
import type { QuizSchema } from "./validation/quiz.schema";

type Props = {
  questionIndex: number;
};

export const OptionsForm = ({ questionIndex }: Props) => {
  const { control } = useFormContext<QuizSchema>();
  const { fields, append, remove } = useFieldArray({ control, name: `questions.${questionIndex}.options` });

  const handleAddOption = () => {
    append({
      id: null,
      label: '',
      is_correct: false,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        {fields.map((item, index) => (
          <motion.div
            className="flex flex-col gap-2 flex-1"
            key={`quiz-question-option-${item.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Controller
              control={control}
              name={`questions.${questionIndex}.options.${index}.label`}
              render={({ field, fieldState: { error } }) => (
                <div key={`quiz-option-${item.id}`} className="flex gap-4 items-end">
                  <TextField
                    label={`Option #${index + 1}`}
                    placeholder="Enter option"
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
            <Controller
              control={control}
              name={`questions.${questionIndex}.options.${index}.is_correct`}
              render={({ field: { onChange, value } }) => (
                <RadioField
                  onChange={(nextValue) => onChange(nextValue === 'true')}
                  value={value.toString()}
                  label="Correct"
                  options={[
                    {
                      value: "true",
                      label: "True",
                    },
                    {
                      value: "false",
                      label: "False",
                    }
                  ]}
                />
              )}
            />
          </motion.div>
        ))}
      </div>
      <div
        onClick={handleAddOption}
        className="text-primary font-[Lato] font-semibold cursor-pointer"
      >
        + Add Option
      </div>
    </div>
  );
};
