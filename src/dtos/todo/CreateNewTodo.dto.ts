import { z } from "zod";

export const createNewTodoSchema = z.object({
  title: z.string({ error: "Title is required" }),
  description: z.string().optional(),
  endDate: z.date().optional(),
  userId: z.number({ error: "User ID is required" }),
});

export type CreateNewTodoDTO = z.infer<typeof createNewTodoSchema>;