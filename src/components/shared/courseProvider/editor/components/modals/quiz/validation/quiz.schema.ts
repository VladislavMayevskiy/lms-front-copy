import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const quizSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number().nullable(),
      content: z.string(),
      is_multiple: z.boolean(),
      options: z.array(
        z.object({
          id: z.number().nullable(),
          label: z.string(),
          is_correct: z.boolean(),
        },
      )),
    }),
  ),
});

export type QuizSchema = z.infer<typeof quizSchema>;

export const quizSchemaResolver = zodResolver(quizSchema);