import { z } from "zod";

export const updateTodoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  endDate: z.date().optional(),
});

export type UpdateTodoDTO = z.infer<typeof updateTodoSchema>;