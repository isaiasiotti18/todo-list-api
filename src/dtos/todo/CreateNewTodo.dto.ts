import { z } from "zod";
import { todoStatusSchema } from "../../types/TodoStatus";

export const createNewTodoSchema = z.object({
  title: z.string({ error: "Title is required" }),
  description: z.string().optional(),
  endDate: z.coerce.date().optional(),
  categoryId: z.number().optional(),
  status: todoStatusSchema.optional(),
  userId: z.number({ error: "User ID is required" }),
});

export type CreateNewTodoDTO = z.infer<typeof createNewTodoSchema>;
