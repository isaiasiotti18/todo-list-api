import { z } from "zod";
import { todoStatusSchema } from "../../types/TodoStatus";

export const updateTodoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: todoStatusSchema.default("in_planning").optional(),
  endDate: z.coerce.date().optional(),
  userId: z.number({ error: "User ID is required" }),
});

export type UpdateTodoDTO = z.infer<typeof updateTodoSchema>;
